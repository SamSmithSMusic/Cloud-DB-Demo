
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://tester1:tester1@cluster0.tlvik.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Object Declaration
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function main() {
  try {
    await client.connect();
    
    // Creates a listing with the year 2027
    // Expected output: New listing created with the following id: ____________
    console.log("\nCreating a new listing...");
    await createListing(client, newListing);

    // Tests to find a listing with that year
    // Expected output: Found a listing in the collection with the year '2027'
    console.log("\nFinding a listing by year test...");
    await findOneListingByYear(client, yearUsed);

    // Tests to update a listing with the new year 2030
    // Expected output: 1 document(s) matched the query criteria.
    // Expected output: 1 document(s) was/were updated.
    console.log("\nUpdating a listing by year test...");
    await updateListingByYear(client, yearUsed, updatedListing);

    // Attemps to find the listing with the old year 2027
    // Expected output: No listings found with the year '2027'
    console.log("\nFinding a listing by old year test...");
    await findOneListingByYear(client, yearUsed);

    // Attemps to find the listing with the new year 2030
    // Expected output: Found a listing in the collection with the year '2030'
    console.log("\nFinding a listing by new year test...");
    await findOneListingByYear(client, "2030");

    // Deletes the listing with the new year 2030
    // Expected output: 1 document(s) was/were deleted.
    console.log("\nDeleting a listing by new year test...");
    await deleteListingByYear(client, "2030");

    // Attemps to find the listing with the new year 2030
    // Expected output: No listings found with the year '2030'
    console.log("\nFinding a listing by new year test (should fail)...");
    await findOneListingByYear(client, "2030");
  } 
  catch (e) {
    console.error(e);
  }
  finally {
    await client.close();
  }
}


// Variable Declaration
var newListing = {
  Concert: "Winter",
  Choir: "Soprano/Alto",
  Song: "Come to Me, O My Love",
  Credit: "Allan Robert Parker",
  Year: "2027",
  Source: "0"
};

var updatedListing = {
  Concert: "Winter",
  Choir: "Soprano/Alto",
  Song: "Come to Me, O My Love",
  Credit: "Allan Robert Parker",
  Year: "2030",
  Source: "0"
};

yearUsed = "2027";



async function createListing(client, newListing){

    var result = await client.db("performances").collection("performances_collection").insertOne(newListing);

    console.log(`New listing created with the following id: ${result.insertedId}`);

}

async function findOneListingByYear(client, year) {

    var result = await client.db("performances").collection("performances_collection").findOne({ Year: year });

    if (result) {

        console.log(`Found a listing in the collection with the year '${year}':`);

        console.log(result);

    } else {

        console.log(`No listings found with the year '${year}'`);

    }
}

async function updateListingByYear(client, yearOfListing, updatedListing) {

    var result = await client.db("performances").collection("performances_collection").updateOne({ Year: yearOfListing }, { $set: updatedListing });

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);

    console.log(`${result.modifiedCount} document(s) was/were updated.`);

}

async function deleteListingByYear(client, yearOfListing) {

    var result = await client.db("performances").collection("performances_collection").deleteOne({ Year: yearOfListing });

    console.log(`${result.deletedCount} document(s) was/were deleted.`);

}

main().catch(console.error);
