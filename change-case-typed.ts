import * as cc from "change-case";
import { ChangeCase as CC } from "./types";

export function camelCase<S extends string>(s: S): CC.Camel<S> {
  return cc.camelCase(s) as CC.Camel<S>;
}

export function snakeCase<S extends string>(s: S): CC.Snake<S> {
  return cc.snakeCase(s) as CC.Snake<S>;
}

export function constantCase<S extends string>(s: S): CC.Const<S> {
  return cc.constantCase(s) as CC.Const<S>;
}

export function pascalCase<S extends string>(s: S): CC.Pascal<S> {
  return cc.pascalCase(s) as CC.Pascal<S>;
}

export function sentenceCase<S extends string>(s: S): CC.Sentence<S> {
  return cc.sentenceCase(s) as CC.Sentence<S>;
}

export function capitalCase<S extends string>(s: S): CC.Capital<S> {
  return cc.capitalCase(s) as CC.Capital<S>;
}

export function headerCase<S extends string>(s: S): CC.Header<S> {
  return cc.headerCase(s) as CC.Header<S>;
}

export function paramCase<S extends string>(s: S): CC.Param<S> {
  return cc.paramCase(s) as CC.Param<S>;
}

export function dotCase<S extends string>(s: S): CC.Dot<S> {
  return cc.dotCase(s) as CC.Dot<S>;
}

export function pathCase<S extends string>(s: S): CC.Path<S> {
  return cc.pathCase(s) as CC.Path<S>;
}

export const changeCase = {
  camelCase,
  snakeCase,
  constantCase,
  pascalCase,
  sentenceCase,
  capitalCase,
  headerCase,
  paramCase,
  dotCase,
  pathCase,
} as const;