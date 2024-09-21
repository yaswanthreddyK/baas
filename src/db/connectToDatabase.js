import { MongoClient, ServerApiVersion } from "mongodb";

export default async function makeDBCalls(uri, queries) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    await client.connect();
    await client.db("text").command({ ping: 1 });
    const db = client.db("text");
    // console.log(queries)
    const parsedQueries = eval(queries);
    let result;
    parsedQueries.forEach((query) => {
       result = Promise.resolve(
        eval("(async (db) => " + query + ")(db)")
      ).then(async (data) => {
        await client.close();
        return data;
      });
    });
    return result;
  } catch (err) {
    console.log(err);
    await client.close();
    return false;
  }
}
