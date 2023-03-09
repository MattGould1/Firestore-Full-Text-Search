/* eslint-disable object-curly-spacing */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { QuerySnapshot } from "firebase-admin/firestore";
import asciiFolder from "./utils/asciiFolder";
import createSearchTerms from "./utils/createSearchTerms";

admin.initializeApp();

type Country = {
  name: string;
  // Probably smart to have this as a uuid :)
  id: string;
};

type Location = Country;

export const addLocation = functions
  .runWith({ timeoutSeconds: 540 })
  .https.onRequest(async (request, response) => {
    const name = request.query.name;
    const id = request.query.id;

    if (name == null || id == null) {
      response.json({
        error: "You must include a 'name' and 'id' in the querystring",
      });
      return;
    }

    /**
     * Do better validation, we don't even check if this item already exists.
     */
    const location: Location = {
      name: name.toString(),
      id: id.toString(),
    };

    /**
     * We save our model (location) and the searchFields separately.
     * When we retrieve a document we throw away the searchFields
     * And keep the modal data.
     */
    const searchFields = {
      terms: createSearchTerms(location.name),
    };

    await admin.firestore().collection("locations").add({
      data: location,
      searchFields,
    });

    response.json({
      result: "Added locations",
    });
  });

export const locations = functions.https.onRequest(
  async (request, response) => {
    const asciiFoldedSearch = asciiFolder(
      request.query.search?.toString() ?? ""
    );

    const results = await admin
      .firestore()
      .collection("locations")
      /** We previously created terms from our country name, not we search. */
      .where("searchFields.terms", "array-contains", asciiFoldedSearch)
      /** Only select our model data, throw away the terms we generated */
      .select("data")
      .limit(5)
      .get();

    const output: Array<Location> = [];

    (results as QuerySnapshot<{ data: Location }>).forEach((doc) => {
      output.push(doc.data().data);
    });

    response.json(output);
  }
);

export const location = functions.https.onRequest(async (request, response) => {
  const id = request.query.id;
  if (id == null) {
    response.json({ error: "You must include an 'id' of the country to find" });
    return;
  }

  const results = await admin
    .firestore()
    .collection("locations")
    .select("data")
    /** Do better validation! */
    .where("data.id", "==", id.toString())
    .limit(1)
    .get();

  const output: Array<Location> = [];

  (results as QuerySnapshot<{ data: Location }>).forEach((doc) => {
    output.push(doc.data().data);
  });

  response.json(output);
});
