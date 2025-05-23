import { connectToMongo } from './utils/mongo';

(async () => {
  try {
    const db = await connectToMongo();
    const videos = await db.collection('videos').find().toArray();

    console.log('✅ Successfully connected to MongoDB');
    console.log('📄 Existing documents in "videos" collection:');
    console.log(videos);
  } catch (err) {
    console.error('❌ MongoDB test failed:', err);
  }
})();
