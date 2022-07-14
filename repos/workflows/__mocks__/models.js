const adminUser = {
  firstName: `Lance`,
  lastName: 'Tipton',
  gitUser: `lancetipton`,
  email: `lancetipton04@gmail.com`,
  id: `RDtGSJQHsnbRbx6tkkKI4MYWVBE3`,
}

const parkinRepo = {
  id: 'j4RvQTluFZ4cNg5Z9vrG',
  collection: 'repos',
  access: {
    RDtGSJQHsnbRbx6tkkKI4MYWVBE3: 99,
    mGIZojdbrU3xYYoZBHf3: 100,
  },
  user: 'mGIZojdbrU3xYYoZBHf3',
  settings: {},
  active: true,
  // branch: 'master',
  branch: `main`,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'parkin',
  paths: {
    artifacts: '/artifacts',
    features: '/bdd/features',
    reports: '/artifacts/reports',
    root: '/goblet',
    steps: '/bdd/steps',
    units: '/units',
    waypoints: '/waypoints',
  },
  provider: 'github.com',
  // url: 'https://github.com/lancetipton/parkin',
  url: `https://github.com/lancetipton/workflows-test`,
}

module.exports = {
  parkinRepo,
  adminUser,
}
