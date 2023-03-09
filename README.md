# Firestore-Full-Text-Search

This is an example of how to search something akin to full text search using Firebase's Firestore. Out of the box Firestore does not support full text search and so we create our own nGrams and combine this with a `array-contains` query. There are limitations to this approach.

1. Document size - Take the word `Hey` for example, we will create the following tokens:

```js
["h", "e", "y", "he", "ey", "hey"];
```

As the word gets longer, so do the tokens we generate. Firestore as of this commit has a maximum document size of 1mb.

2. Word order - Take the words `Hey everyone`, if the user searches for `everyone hey` they would find no results. The tokens we generate only go forward (this reduces the size of the tokens).

## Setup

This is a firebase project, it contains a `.firebaserc`, you will need to init or add an existing project to do so

```bash
firebase use --add
```

## Testing

### Add a location

```
http://127.0.0.1:5001/locations-5dce0/us-central1/addLocation?name=United%20Kingdom&id=uuid-123
```

### Query for your location

```
http://127.0.0.1:5001/locations-5dce0/us-central1/locations?search=king
```

### Get your location by id

```
http://127.0.0.1:5001/locations-5dce0/us-central1/location?id=uuid-123
```

You can take a look at [https://mattgould.dev/blog/creating-full-text-search-with-firestore/](https://mattgould.dev/blog/creating-full-text-search-with-firestore/) for a few more details
