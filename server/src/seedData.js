function getSeedEvents() {
  const now = new Date();
  
  // Create realistic future dates (3, 7, 12, 18, 25, 30, 40 days in future)
  const addDays = (days, hours = 10) => {
    const d = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    d.setHours(hours, 0, 0, 0);
    return d.toISOString();
  };

  return [
    {
      title: "Winter Clothes & Warm Jackets Distribution",
      description: "Join hands with local community volunteers to distribute over 1,200 warm winter jackets, sweaters, and thermals to underprivileged families and children facing severe cold waves in urban settlements across Mirpur.",
      eventType: "Donation",
      thumbnail: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
      location: "Mirpur 10 Community Center, Dhaka",
      eventDate: addDays(4, 9),
      organizerEmail: "jisan33.info@gmail.com",
      organizerName: "Jisan Ahmed",
      organizerPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "Blanket Distribution for the Needy",
      description: "Providing premium fleece blankets and emergency cold protection packs to elderly street dwellers, rickshaw pullers, and low-income families during nighttime winter temperatures in Mohammadpur.",
      eventType: "Donation",
      thumbnail: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80",
      location: "Mohammadpur Town Hall Ground, Dhaka",
      eventDate: addDays(8, 20),
      organizerEmail: "tahsin.care@kindredpulse.org",
      organizerName: "Tahsin Rahman",
      organizerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "Buriganga Riverside Plastic Cleanup Drive",
      description: "A grassroots environmental campaign to extract non-biodegradable plastics, organize waste segregation workshops, and install recycling collection bins along the historic Buriganga riverbank.",
      eventType: "Cleanup",
      thumbnail: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80",
      location: "Sadarghat Riverside Terminal, Old Dhaka",
      eventDate: addDays(12, 8),
      organizerEmail: "jisan33.info@gmail.com",
      organizerName: "Jisan Ahmed",
      organizerPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "Urban Tree Plantation & Green Corridor Project",
      description: "Volunteers will plant 500 indigenous shade and fruit-bearing saplings around the recreational paths of Dhanmondi Lake to combat urban heat islands and enhance local biodiversity.",
      eventType: "Plantation",
      thumbnail: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
      location: "Dhanmondi Lake Park (Sector 7), Dhaka",
      eventDate: addDays(16, 7),
      organizerEmail: "farhan.eco@kindredpulse.org",
      organizerName: "Farhan Kabir",
      organizerPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "Community Free Health Screening & Eye Care Camp",
      description: "Collaborative medical camp providing complimentary primary health consultations, blood glucose screening, pediatric wellness checks, and prescription reading glasses for Korail residents.",
      eventType: "Healthcare",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      location: "Korail Community Welfare Hall, Gulshan, Dhaka",
      eventDate: addDays(21, 9),
      organizerEmail: "dr.sumaiya@kindredpulse.org",
      organizerName: "Dr. Sumaiya Akhtar",
      organizerPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "Surplus Food Rescue & Evening Nutrition Drive",
      description: "Partnering with local bakeries and restaurants to safely rescue nutritious surplus meals, packaging them hygienically, and delivering dinner packs to daily wage workers and shelter homes.",
      eventType: "Food Rescue",
      thumbnail: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
      location: "Farmgate Footbridge & Public Square, Dhaka",
      eventDate: addDays(25, 18),
      organizerEmail: "jisan33.info@gmail.com",
      organizerName: "Jisan Ahmed",
      organizerPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "Backpack & Learning Kit Drive for Children",
      description: "Distributing school bags, geometry sets, notebooks, and solar-powered study lanterns to 300 young students enrolled in non-formal community learning centers.",
      eventType: "Education",
      thumbnail: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
      location: "Kamrangirchar Public Primary School Grounds, Dhaka",
      eventDate: addDays(30, 10),
      organizerEmail: "nabil.edu@kindredpulse.org",
      organizerName: "Nabil Chowdhury",
      organizerPhoto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "Coastal Mangrove Nursery & Sapling Plantation",
      description: "Restoring saline-resistant mangrove barriers by planting over 1,000 sundari and keora saplings to protect coastal settlements from recurring cyclone surges.",
      eventType: "Plantation",
      thumbnail: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
      location: "Kuakata Coastline & Eco-Park, Patuakhali",
      eventDate: addDays(38, 7),
      organizerEmail: "farhan.eco@kindredpulse.org",
      organizerName: "Farhan Kabir",
      organizerPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
}

module.exports = { getSeedEvents };
