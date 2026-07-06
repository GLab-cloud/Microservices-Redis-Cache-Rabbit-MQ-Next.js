import mongoose from "mongoose";
const connectDb = async () => {
    if (!process.env.MONGO_URI) {
        console.error("Error: MONGO_URI undefined in file .env!");
        process.exit(1);
    }
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Mongo DB");
        connectAndActivate();
        checkDatabaseExists();
    }
    catch (error) {
        console.log(error);
    }
};
async function checkDatabaseExists() {
    try {
        const db = mongoose.connection.db;
        if (!db) {
            console.log("Database instance is not available");
            return;
        }
        const adminDb = db.admin();
        const dbsList = await adminDb.listDatabases();
        const dbNames = dbsList.databases.map((db) => db.name);
        const isExist = dbNames.includes("BlogApp");
        console.log("--- DATABASE ON CLUSTER ---");
        console.log(dbNames);
        console.log("----------------------------------------");
        if (isExist) {
            console.log("Database 'BlogApp' already exist on Cluster!");
        }
        else {
            console.log("Database 'BlogApp' does not exist on the cluster (or it is empty).");
        }
    }
    catch (error) {
        console.error(error);
    }
}
const TestModel = mongoose.model("test_collection", new mongoose.Schema({ name: String }));
async function connectAndActivate() {
    try {
        await TestModel.create({ name: "activate database BlogApp" });
    }
    catch (error) {
        console.error(error);
    }
}
export default connectDb;
