// This is part of a coding assessment for Aclymate
// Author: Cameron Handeland


// Compares the type of bodyProp to schemaProp
// if schemaProp is an array of strings describing types,
// then bodyProp can be any of the types in the array
function compareTypes(bodyProp, schemaProp){
    if(Array.isArray(schemaProp)){
        return schemaProp.includes(typeof(bodyProp))
    }
    else return typeof(bodyProp) === schemaProp
}

// Checks a body property against the schema to verify if it matches
// Inputs:
//     bodyProp   - the property being compared
//     schemaProp - the corresponding schema property that bodyProp must match
// returns:
//     true if bodyProp matches the schema
//     false if bodyProp does not match the schema
function isValidProperty(bodyProp, schemaProp){
    if(compareTypes(bodyProp, schemaProp.type)){
        if(schemaProp.type === "object"){
            // there are more sub-props to check...
            for(key in schemaProp){
                // ignore schema-specific props ('type' and 'required')
                if(key !== "type" && key !== "required"){
                    if(schemaProp[key].required){
                        //this sub-prop needs to be present
                        if(bodyProp.hasOwnProperty(key)){
                            // prop exists
                            if(!isValidProperty(bodyProp[key], schemaProp[key])){
                                return false
                            }
                        }
                        else{
                            // prop does not exist and was required to exist
                            return false
                        }
                    }
                    else{
                        //sub-prop does not need to exist, but should be valid if present
                        if(!isValidProperty(bodyProp[key], schemaProp[key])){
                            return false
                        }
                    }
                }
            }
            
        }
        return true
    }
    else{
        //prop did not exist, but needed to
        return false
    }
}

// This is the main function requested by Aclymate
// Inputs:
//    body   - a JS object containing data destined for an API call
//    schema - a JS object acting as the template describing data contained
//             in a valid API request. 
//             schema properties follow this format:
//                 propertyName: {type: <dataType>, required: <boolean>}
//             or:
//                 propertyName: {
//                     type: "object", 
//                     required: <boolean>,
//                     property1: val1,
//                     property2: val2,
//                     ...
//                 } 
// Returns:
//    true if every field marked as required in the schema is present in the body and all
//    fields in the body (even non-required ones) have the appropriate datatype specified
//    by the schema
//    false if any required field is not present or any field's dataType is different from
//    what is specified in the schema
function schemaChecker(body, schema){

    var isValidBody = true

    for (key in schema){
        if (schema[key].required){
            if(body.hasOwnProperty(key)){
                if(!isValidProperty(body[key], schema[key])){
                    isValidBody = false
                    break
                }
            }
            else{
                isValidBody = false
                break
            }
        }
        else{
            // property isn't required, but should still be valid
            if(!isValidProperty(body[key], schema[key])){
                isValidBody = false
                break
            }
        }
    }

    return isValidBody
}

function test_schemaChecker(){
    var hasPassed = true 

    // test1: using supplied objects
    var schema = {
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

    var body = {
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

    if(!schemaChecker(body, schema)){
        console.log("test1 failed: body met schema, but failed check")
        hasPassed = false
    }

    //test2: the body has missing, but required property 'age'
    var body = {
        name: "William Loopesko",
    //    age: 33,
        founder: true,
        company: "Aclymate",
        address: {
            description: "2432 S. Downing St, Denver, CO 80210",
            county: "Denver",
            country: "USA"
        }
    }

    if(schemaChecker(body, schema)){
        console.log("test2 failed: body lacked required field, but passed check")
        hasPassed = false
    }

    //test3: body has required property, but it is of wrong type (age is a string)
    var body = {
        name: "William Loopesko",
        age: "33",
        founder: true,
        company: "Aclymate",
        address: {
            description: "2432 S. Downing St, Denver, CO 80210",
            county: "Denver",
            country: "USA"
        }
    }

    if(schemaChecker(body, schema)){
        console.log("test3 failed: body property had wrong type, but passed check")
        hasPassed = false
    }

    //test4: schema has a double-nested prop and body matches properly
    var schema = {
        test4: {
            type: "object", 
            required: true,
            test4_1: {
                type: "object",
                required: true,
                test4_2:{
                    type: "object",
                    required: true,
                    a: {type: "number", required: true},
                    b: {type: "string", required: true}
                }
            }
        }
    }

    var body = {
        test4: {
            test4_1: {
                test4_2: {
                    a: 3,
                    b: "hello"
                }
            }
        }
    }
    
    if(!schemaChecker(body,schema)){
        console.log("test4 failed: schema had double-nested object and body matched its requirements")
        hasPassed = false
    }

    //test5: same as test4, but body does not match schema
    var body = {
        test4: {
            test4_1: {
                test4_2: "hello"
            }
        }
    }

    if(schemaChecker(body,schema)){
        console.log("test5 failed: schema had double-nested object and body did not match its requirements")
        hasPassed = false
    }
    
    //test6: schema type is an array. body can be any of these types
    var schema = {
        test6: {type:['string', 'number'], required: true}
    }
    var body = {
        test6: "hello"
    }
    if(!schemaChecker(body, schema)){
        console.log("test6 failed: schema had an array of possible types and body had one of them (string)")
        hasPassed = false
    }

    body = {
        test6: 3
    }
    if(!schemaChecker(body, schema)){
        console.log("test6 failed: schema had an array of possible types and body had one of them (number)")
        hasPassed = false
    }

    body = {
        test6: {value: "this is the incorrect type"}
    }
    if(schemaChecker(body, schema)){
        console.log("test6 failed: schema had an array of possible types and body had one of them (object)")
        hasPassed = false
    }

    return hasPassed
}

if(test_schemaChecker()){
    console.log("tests have passed: ")
}
else console.log("tests have failed")