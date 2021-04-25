# JavaScript schemaChecker

This script was done as a part of a code assessment by [Aclymate](https://aclymate.com/) by Cameron Handeland

## Usage
Given an API body to verify:
```
const body = {
  name: "William Loopesko",
  age: 33,
  founder: true,
  company: "Aclymate",
  address: {
    description: "2432 S. Downing St, Denver, CO 80210",
    county: "Denver",
    country: "USA"
  }
}
```
And a schema to compare against:
```
const schema = {
  name: {type: "string", required: true},
  age: {type: "number", required: true},
  founder: {type: "boolean", required: false},
  company: {type: "string", required: true},
  address: {
    type: "object", 
    required: true,
    description: {type: "string", required: true},
    county: {type: "string", required: false},
    country: {type: "string", required: false}
  }
}
```

The function `schemaChecker(body, schema)` will return `true` if the body matches the schema and `false` if it does not

The general format of schema properties follows:
```
propertyName: {type: <propertyType>, required <boolean>}
```
where:  
 * `propertyName` is the key to be expected in the body,  
 * `type` is the the expected type of the field under the key  
    * This can be an array of types as well.  
    * ex: `type: ['string', 'number]`  
    * the corresponding property of the body can be any of these values.
 * `required` specifies whether the body can omit this property or not.

The body properties can be arrays as well. Currently, each element of the array will be compared to the acceptable
types for the given property name in the schema.  

For example:
```
    var schema = {
        a: {type: ["number", "string"], required: true}
    }
        var body = {
        a: [1, 2, 3, 'hello']
    }
    checkSchema(body, schema) //returns true
```

## Testing
There is a function called `test_schemaChecker` in `./schemaChecker.js`,

if `schemaChecker.js` is passed through a js interpreter, `test_schemaChecker` will run and report whether `schemaChecker` passed tests or not.

I've been using:
```
node ./schemaChecker.js
```
to run this script