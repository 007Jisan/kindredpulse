const express = require('express');
const { getDB, ObjectId } = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

function parseId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return id;
  }
}

// POST /api/joined-events
// Protected: Join an event (stores event data and user data in DB)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required to join an event.',
      });
    }

    const db = getDB();
    const eventsCollection = db.collection('events');
    const joinedCollection = db.collection('joined_events');

    let event = null;
    try {
      event = await eventsCollection.findOne({ _id: parseId(eventId) });
    } catch {
      event = await eventsCollection.findOne({ _id: eventId });
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'The event you are trying to join does not exist.',
      });
    }

    // Check if the event date has already passed
    if (new Date(event.eventDate).getTime() < new Date().getTime()) {
      return res.status(400).json({
        success: false,
        message: 'This event has already concluded and is no longer accepting volunteers.',
      });
    }

    // Check if already joined
    const alreadyJoined = await joinedCollection.findOne({
      eventId: (event._id || eventId).toString(),
      userEmail: req.user.email.toLowerCase(),
    });

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: 'You have already joined this event.',
      });
    }

    const joinRecord = {
      eventId: (event._id || eventId).toString(),
      eventTitle: event.title,
      eventType: event.eventType,
      thumbnail: event.thumbnail,
      location: event.location,
      eventDate: event.eventDate,
      organizerEmail: event.organizerEmail,
      organizerName: event.organizerName,
      userEmail: req.user.email.toLowerCase(),
      userName: req.user.name,
      userPhoto: req.user.photoURL,
      joinedAt: new Date().toISOString(),
    };

    const result = await joinedCollection.insertOne(joinRecord);

    res.status(201).json({
      success: true,
      message: 'Successfully joined the event! See you there.',
      joinRecord: {
        ...joinRecord,
        _id: result.insertedId || result._id,
      },
    });
  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join event.',
    });
  }
});

// GET /api/joined-events
// Protected: Get all events joined by logged-in user, sorted by event date!
router.get('/', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const joinedCollection = db.collection('joined_events');

    // Requirement: "Show events sorted by event date"
    const joinedEvents = await joinedCollection
      .find({ userEmail: req.user.email.toLowerCase() })
      .sort({ eventDate: 1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: joinedEvents.length,
      events: joinedEvents,
    });
  } catch (error) {
    console.error('Fetch joined events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your joined events.',
    });
  }
});

// DELETE /api/joined-events/:id
// Protected: Cancel event participation
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const joinedCollection = db.collection('joined_events');

    let joinRecord = null;
    try {
      joinRecord = await joinedCollection.findOne({ _id: parseId(id) });
    } catch {
      joinRecord = await joinedCollection.findOne({ _id: id });
    }

    // Also allow passing eventId directly
    if (!joinRecord) {
      joinRecord = await joinedCollection.findOne({
        eventId: id,
        userEmail: req.user.email.toLowerCase(),
      });
    }

    if (!joinRecord) {
      return res.status(404).json({
        success: false,
        message: 'Join record not found.',
      });
    }

    if (joinRecord.userEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only cancel your own participation.',
      });
    }

    try {
      await joinedCollection.deleteOne({ _id: parseId(joinRecord._id) });
    } catch {
      await joinedCollection.deleteOne({ _id: joinRecord._id });
    }

    res.status(200).json({
      success: true,
      message: 'Event participation canceled successfully.',
    });
  } catch (error) {
    console.error('Cancel join error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel participation.',
    });
  }
});

module.exports = router;
