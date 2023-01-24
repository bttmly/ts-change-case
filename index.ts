type Alphabet = "abcdefghijklmnopqrstuvwxyz"
type Digits = "0123456789"

// https://www.typescriptlang.org/play/4-1/template-literals/string-manipulation-with-template-literals.ts.html
type Split<S extends string, D extends string> =
  string extends S ? 
    string[] :
  S extends '' ? 
    [] :
  S extends `${infer T}${D}${infer U}` ? 
    [T, ...Split<U, D>] : 
    [S];

type CharUnion<S extends string> = Split<S, "">[number];

// type CharUnion<S extends string, U extends string = never> =
//   S extends "" ? 
//     U :
//   S extends `${infer First}${infer Rest}` ? 
//     CharUnion<Rest, U | First> :
//     never;

export type DigitChars = CharUnion<Digits>
export type LowercaseChars = CharUnion<Alphabet>
export type UppercaseChars = CharUnion<Uppercase<Alphabet>>
export type AlphanumericChars = UppercaseChars | LowercaseChars | DigitChars;

type CapitalCase<S extends string> = 
  S extends "" ? 
    "" :
  S extends `${infer First}${infer Rest}` ? 
    `${Uppercase<First>}${Lowercase<Rest>}` : 
    never;

type Without<S extends string, P extends string[], A extends string[] = []> =
  P extends [] ? 
    A :
  P extends [infer First extends string, ...infer Rest extends string[]] ?
    First extends S ?
      Without<S, Rest, A> :
      Without<S, Rest, [...A, First]> : 
    never;

type WithoutEmpty<P extends string[]> = Without<"", P>

type KeepChars<S extends string, C extends string, A extends string = ""> =
  S extends "" ?
    A :
  S extends `${infer First}${infer Rest}` ?
    First extends C ?
    KeepChars<Rest, C, `${A}${First}`> :
    KeepChars<Rest, C, A> :
  never;

type PrependIfStartsWithDigit<S extends string, D extends string> =
  S extends "" ? 
    "" :
  S extends `${infer _First extends DigitChars}${string}` ? 
    `${D}${S}` :
    S;

type AsStringArray<T extends string[]> = T extends string[] ? T : never;
export type MapToLowercase<T extends string[]> = AsStringArray<{ [K in keyof T]: Lowercase<T[K]> }>;
export type MapToUppercase<T extends string[]> = AsStringArray<{ [K in keyof T]: Uppercase<T[K]> }>;
export type MapToCapital<T extends string[]> = AsStringArray<{ [K in keyof T]: CapitalCase<T[K]> }>;
export type MapToCamel<T extends string[]> = AsStringArray<{ [K in keyof T]: K extends "0" ? Lowercase<T[K]> : CapitalCase<T[K]> }>;
export type MapToSentence<T extends string[]> = AsStringArray<{ [K in keyof T]: K extends "0" ? CapitalCase<T[K]> : Lowercase<T[K]> }>;
export type MapToPascal<T extends string[]> = AsStringArray<{ [K in keyof T]: K extends "0" ? CapitalCase<T[K]> : PrependIfStartsWithDigit<CapitalCase<T[K]>, "_"> }>;
export type MapToOnlyChars<T extends string[], C extends string> = AsStringArray<{ [K in keyof T]: KeepChars<T[K], C> }>;

// this is probably missing some cases
type _CamelSplit<S extends string, D extends string, Acc extends string = "", Tokens extends string[] = []> =
  string extends S ? string[] :
  // we may have added empty strings to Tokens, but they'll get filtered by SplitStrip
  S extends "" ? [...Tokens, Acc] :
  // in "camelCase" this branch splits to after "camel"
  S extends `${infer T extends LowercaseChars}${infer U extends UppercaseChars}${infer Rest}` ?
    _CamelSplit<`${U}${Rest}`, D, "", [...Tokens, `${Acc}${T}`]> :
  // in "CAMELCase" this branch splits after "CAMEL"
  S extends `${infer T extends UppercaseChars}${infer U extends UppercaseChars}${infer V extends LowercaseChars}${infer Rest}` ?
    _CamelSplit<`${U}${V}${Rest}`, D, "", [...Tokens, `${Acc}${T}`]> :
  // in "camel_case" this branch splits after "camel" (assuming "_" is in D)
  S extends `${D}${infer U}` ? 
    _CamelSplit<U, D, "", [...Tokens, Acc]> :
  // base case – add the current character to Acc and continue
  S extends `${infer T extends string}${infer Rest}` ?
    _CamelSplit<`${Rest}`, D, `${Acc}${T}`, Tokens> : 
    never

export type SplitStrip<S extends string, D extends string, C extends string = AlphanumericChars> = WithoutEmpty<MapToOnlyChars<_CamelSplit<S, D>, C>>;

type _Join<P extends string[], D extends string, J extends string = ""> =
  P extends [] ? 
    J :
  P extends [infer First extends string, ...infer Rest extends string[]] ?
    J extends "" ? _Join<Rest, D, First> : _Join<Rest, D, `${J}${D}${First}`> :
    never;

export type Join<P extends string[], D extends string> = _Join<P, D>;

export type Delimiters = "_" | " " | "-" | ".";

type SplitStripCapitalJoin<S extends string, D extends string, J extends string> = Join<MapToCapital<SplitStrip<S, D>>, J>;
type SplitStripLowerJoin<S extends string, D extends string, J extends string> = Join<MapToLowercase<SplitStrip<S, D>>, J>;

export type ToPascalAlphanumeric<S extends string, D extends string = Delimiters> = SplitStripCapitalJoin<S, "", D>;
export type ToCapital<S extends string, D extends string = Delimiters> = SplitStripCapitalJoin<S, D, " ">;
export type ToHeader<S extends string, D extends string = Delimiters> = SplitStripCapitalJoin<S, D, "-">;
export type ToParam<S extends string, D extends string = Delimiters> = SplitStripLowerJoin<S, D, "-">;
export type ToDot<S extends string, D extends string = Delimiters> = SplitStripLowerJoin<S, D, ".">;
export type ToSnake<S extends string, D extends string = Delimiters> = SplitStripLowerJoin<S, D, "_">;
export type ToPath<S extends string, D extends string = Delimiters> = SplitStripLowerJoin<S, D, "/">;
export type ToPascal<S extends string, D extends string = Delimiters> = Join<MapToPascal<SplitStrip<S, D>>, "">;
export type ToCamel<S extends string, D extends string = Delimiters> = Join<MapToCamel<SplitStrip<S, D>>, "">;
export type ToSentence<S extends string, D extends string = Delimiters> = Join<MapToSentence<SplitStrip<S, D>>, " ">;
export type ToConst<S extends string, D extends string = Delimiters> = Join<MapToUppercase<SplitStrip<S, D>>, "_">;

// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
// deno-lint-ignore no-explicit-any
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;
// deno-lint-ignore no-explicit-any
type ToArray<Type> = Type extends any ? Type[] : never;

export type UniqueString<S extends string> = 
  string extends S ? 
  never :
  ToArrayNonDist<S> extends ToArray<S> ? 
  S : 
  never;

type SingleChars<S extends string> = 
  S extends "" ? 
    never : 
  S extends `${infer _A}${infer B}` ?
    B extends "" ? 
      S : 
      never : 
    never;

export type OnlyLowercase<S extends string> = S extends Lowercase<S> ? S : never;
export type OnlyUppercase<S extends string> = S extends Uppercase<S> ? S : never;
export type OnlyChars<S extends string, C extends string> = CharUnion<S> extends CharUnion<C> ? S : never;
export type OnlySingleChars<S extends string> = [S] extends [SingleChars<S>] ? S : never

type S2 = "some TERRIBLE.2ERRORCondition___HOWSad"
// type S2 = "version 1.21.0;0"
// type S2 = "some-thing;;-;;"
// type S2 = ""
type CC2 = [
  ToPascal<S2>,
  ToCapital<S2>,
  ToHeader<S2>,
  ToParam<S2>,
  ToDot<S2>,
]

type CC3 = [
  ToSnake<S2>,
  ToPath<S2>,
  ToCamel<S2>,
  ToSentence<S2>,
  ToConst<S2>,
]

// type CC4 = [
//   OnlyLowercase<ToSnake<S2>>,
//   OnlyUppercase<ToSnake<S2>>,
//   OnlyLowercase<ToConst<S2>>,
//   OnlyUppercase<ToConst<S2>>,
// ]