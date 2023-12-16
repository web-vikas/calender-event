import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("calender-events");
  const collection = db.collection("CalendarEvents");

  if (req.method === "GET") {
    try {
      const events = await collection.find({}).toArray();
      res.status(200).json({ events });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    try {
      const { title, start, end, backgroundColor, description, eventId } = req.body;

      const eventData = {
        title,
        start,
        end,
        backgroundColor,
        description,
      };

      if (eventId) {
        await collection.updateOne(
          { _id: new ObjectId(eventId) },
          { $set: eventData }
        );
      } else {
        await collection.insertOne(eventData);
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
