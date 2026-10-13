// The form uses these field names (camelCase, same as the request body).
export const FORM_FIELDS = [
  "hostname",
  "name",
  "deviceType",
  "deviceGroupId",
];

// Turns an ASP.NET ValidationProblemDetails response into { fieldName: "message" }
// for the register form. Examples of what the API sends back:
//
//   409  { "title": "Hostname is already in use.",
//          "errors": { "Hostname": ["A device with hostname nas-01 is already registered."] } }
//
//   400  { "title": "One or more validation errors occurred.",
//          "errors": { "Name":     ["Device name can be at most 100 characters."],
//                      "Hostname": ["Hostname is required."] } }
//
//   400  { "errors": { "$.deviceType": ["The JSON value could not be converted to ..."] } }
//
// Return only keys that appear in FORM_FIELDS. Anything you can't match to a field
// can go under "_form" so the page can still show it in the summary banner.
export function toFieldErrors(problem) {
  // TODO: map problem.errors to the form's field names.
  return {};
}
