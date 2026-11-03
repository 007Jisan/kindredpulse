const express = require('express');
const { getDB, ObjectId } = require('../db');
const { verifyToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Helper to safely parse MongoDB ObjectId or return string if in memory fallback
function parseId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return id;
  }
}

// GET /api/events
// Public: supports limit (e.g. 6 for Home page), category, search, and upcomingOnly
router.get('/', async (req, res) => {
  try {
    const { limit, category, search, upcomingOnly = 'true' } = req.query;
    const db = getDB();
    const eventsCollection = db.collection('events');

    const query = {};
    const nowISO = new Date().toISOString();

    // Upcoming events only filter (strictly >= current timestamp)
    if (upcomingOnly === 'true') {
      query.eventDate = { $gte: nowISO };
    }

    if (category && category !== 'All') {
      query.eventType = category;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    let cursor = eventsCollection.find(query).sort({ eventDate: 1 });

    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        cursor = cursor.limit(limitNum);
      }
    }

    const events = await cursor.toArray();

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error('Fetch events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve events.',
    });
  }
});

// GET /api/events/user/:email
// Protected: Retrieve all events created by a specific user (Manage Events)
router.get('/user/:email', verifyToken, async (req, res) => {
  try {
    const targetEmail = req.params.email.toLowerCase().trim();

    // Security check: users can only fetch their own created events via this endpoint
    if (req.user.email.toLowerCase() !== targetEmail) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden. You cannot access another user’s managed events.',
      });
    }

    const db = getDB();
    const eventsCollection = db.collection('events');

    const userEvents = await eventsCollection
      .find({ organizerEmail: targetEmail })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: userEvents.length,
      events: userEvents,
    });
  } catch (error) {
    console.error('Fetch user events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your managed events.',
    });
  }
});

// GET /api/events/:id
// Public: Retrieve single event details and participants
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const eventsCollection = db.collection('events');
    const joinedCollection = db.collection('joined_events');

    let event = null;
    try {
      event = await eventsCollection.findOne({ _id: parseId(id) });
    } catch {
      event = await eventsCollection.findOne({ _id: id });
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'The requested social development event was not found.',
      });
    }

    // Retrieve participants who joined this event
    const participants = await joinedCollection
      .find({ eventId: event._id.toString() })
      .sort({ joinedAt: -1 })
      .toArray();

    // Check if the current requesting user has already joined
    let hasJoined = false;
    if (req.user && req.user.email) {
      const userJoined = await joinedCollection.findOne({
        eventId: event._id.toString(),
        userEmail: req.user.email.toLowerCase(),
      });
      hasJoined = !!userJoined;
    }

    res.status(200).json({
      success: true,
      event,
      participantCount: participants.length,
      participants: participants.map((p) => ({
        userEmail: p.userEmail,
        userName: p.userName,
        userPhoto: p.userPhoto,
        joinedAt: p.joinedAt,
      })),
      hasJoined,
    });
  } catch (error) {
    console.error('Fetch event detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load event details.',
    });
  }
});

// POST /api/events
// Protected: Create Event (strict future date validation, stores organizer email)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, eventType, thumbnail, location, eventDate } = req.body;

    // Field existence validation
    if (!title || !description || !eventType || !location || !eventDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields (title, description, event type, location, date) are mandatory.',
      });
    }

    // Strict Future Date validation requirement
    const parsedDate = new Date(eventDate);
    const now = new Date();
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event date provided.',
      });
    }
    if (parsedDate.getTime() <= now.getTime()) {
      return res.status(400).json({
        success: false,
        message: 'Event date must be strictly set in the future. Past dates are not permitted.',
      });
    }

    const defaultThumbnail =
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80';

    const newEvent = {
      title: title.trim(),
      description: description.trim(),
      eventType: eventType.trim(),
      thumbnail: thumbnail && thumbnail.trim() ? thumbnail.trim() : defaultThumbnail,
      location: location.trim(),
      eventDate: parsedDate.toISOString(),
      organizerEmail: req.user.email.toLowerCase(),
      organizerName: req.user.name || 'Community Organizer',
      organizerPhoto: req.user.photoURL || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const db = getDB();
    const eventsCollection = db.collection('events');
    const result = await eventsCollection.insertOne(newEvent);

    res.status(201).json({
      success: true,
      message: 'Social development event created successfully!',
      event: {
        ...newEvent,
        _id: result.insertedId || result._id,
      },
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event. Please verify your inputs.',
    });
  }
});

// PUT /api/events/:id
// Protected: Update Event (Users can only update their own created event data!)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, eventType, thumbnail, location, eventDate } = req.body;

    const db = getDB();
    const eventsCollection = db.collection('events');
    const joinedCollection = db.collection('joined_events');

    let existingEvent = null;
    try {
      existingEvent = await eventsCollection.findOne({ _id: parseId(id) });
    } catch {
      existingEvent = await eventsCollection.findOne({ _id: id });
    }

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found for updating.',
      });
    }

    // Security check: Only the creator can update their event
    if (existingEvent.organizerEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only update events that you personally created.',
      });
    }

    const updateFields = {
      updatedAt: new Date().toISOString(),
    };

    if (title && title.trim()) updateFields.title = title.trim();
    if (description && description.trim()) updateFields.description = description.trim();
    if (eventType && eventType.trim()) updateFields.eventType = eventType.trim();
    if (thumbnail && thumbnail.trim()) updateFields.thumbnail = thumbnail.trim();
    if (location && location.trim()) updateFields.location = location.trim();

    if (eventDate) {
      const parsedDate = new Date(eventDate);
      if (isNaN(parsedDate.getTime()) || parsedDate.getTime() <= new Date().getTime()) {
        return res.status(400).json({
          success: false,
          message: 'Updated event date must be strictly in the future.',
        });
      }
      updateFields.eventDate = parsedDate.toISOString();
    }

    let filter = { _id: parseId(id) };
    try {
      await eventsCollection.updateOne(filter, { $set: updateFields });
    } catch {
      await eventsCollection.updateOne({ _id: id }, { $set: updateFields });
    }

    // Sync updated info in joined_events
    await joinedCollection.updateMany(
      { eventId: id },
      {
        $set: {
          eventTitle: updateFields.title || existingEvent.title,
          eventType: updateFields.eventType || existingEvent.eventType,
          thumbnail: updateFields.thumbnail || existingEvent.thumbnail,
          location: updateFields.location || existingEvent.location,
          eventDate: updateFields.eventDate || existingEvent.eventDate,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: 'Event updated successfully!',
      event: { ...existingEvent, ...updateFields },
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event.',
    });
  }
});

// DELETE /api/events/:id
// Protected: Delete Event (Users can only delete their own created event data!)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const eventsCollection = db.collection('events');
    const joinedCollection = db.collection('joined_events');

    let existingEvent = null;
    try {
      existingEvent = await eventsCollection.findOne({ _id: parseId(id) });
    } catch {
      existingEvent = await eventsCollection.findOne({ _id: id });
    }

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Security check: Only creator can delete
    if (existingEvent.organizerEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only delete events that you created.',
      });
    }

    try {
      await eventsCollection.deleteOne({ _id: parseId(id) });
    } catch {
      await eventsCollection.deleteOne({ _id: id });
    }

    // Cascade delete any joined event records
    await joinedCollection.deleteMany({ eventId: id });

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully along with associated registrations.',
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event.',
    });
  }
});

module.exports = router;
