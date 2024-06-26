import {isArray, isString, toPairs, map, isObject, fromPairs} from "lodash";


const iso8601Regex =
  /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

/**
 * @typedef TResponseTransformFunction
 * @template {Record<PropertyKey, any>} Value
 * @type {(object: Value) => Value}
 */

/**
 * Transform
 *
 * @param {Value} object
 * @template {Record<PropertyKey, any>} Value
 * @return Value
 */
export const transformDate = (object) => {
  if (isArray(object)) return object;

  const pairedObject = toPairs(object);

  const updatedObject = map(pairedObject, ([key, value]) => {
    if (isString(value) && iso8601Regex.test(value)) {
      return [key, new Date(value)];
    }

    if (isArray(value)) {
      return [key, value.map(transformDate)];
    }

    if (isObject(value)) {
      return [key, transformDate(value)];
    }

    return [key, value];
  });

  return fromPairs(updatedObject);
};

/**
 * Apply a list of transforms to an object
 *
 * @param {Array<TResponseTransformFunction<Value>>} transforms
 * @template {Record<PropertyKey, string>} Value
 * @return {TResponseTransformFunction<Value>}
 */
export const applyTransforms = (...transforms) =>
    (object) =>
      transforms.reduce(
          (acc, transform) =>
              transform(acc),
          object
      );