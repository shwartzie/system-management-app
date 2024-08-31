import mongoose from 'mongoose';

// MongoDB connect.
export const connectDb = (MONGO_URL: string = '') => {
	try {
		mongoose.connect(MONGO_URL);
		const db = mongoose.connection;
		db.on('error', (error) => console.error(error));
		db.once('open', () => console.log('Connected to DB'));
		return db;
	} catch (error) {
		console.log('DB error: ', error);
	}
};

// Utility function to create a collection if it does not exist
export const createCollectionIfNotExists = async (mongooseConnection: mongoose.Connection, collectionName: string) => {
    const mongoDb = mongooseConnection.getClient().db();
    const collections = await mongoDb.listCollections({ name: collectionName }).toArray();
    if (collections.length === 0) {
        await mongoDb.createCollection(collectionName);
    }
};
