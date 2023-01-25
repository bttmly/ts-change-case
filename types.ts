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
export type DigitChars = CharUnion<Digits>
export type LowercaseChars = CharUnion<Alphabet>
export type UppercaseChars = CharUnion<Uppercase<Alphabet>>
export type AlphanumericChars = UppercaseChars | LowercaseChars | DigitChars;

type Capitalize<S extends string> =
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

type KeepChars<S extends string, C extends string> = _KeepChars<Split<S, "">, C>
type _KeepChars<S extends string[], C extends string, A extends string = ""> =
  S extends [] ?
    A :
    S extends [infer First extends string, ...infer Rest extends string[]] ?
      First extends C ?
        _KeepChars<Rest, C, `${A}${First}`> :
        _KeepChars<Rest, C, A> :
      never;

type PrependIfStartsWithDigit<S extends string, D extends string> =
  S extends "" ?
    "" :
    S extends `${infer _First extends DigitChars}${string}` ?
      `${D}${S}` :
      S;

type AsStringArray<T extends string[]> = T extends string[] ? T : never;
type MapToLowercase<T extends string[]> = AsStringArray<{ [K in keyof T]: Lowercase<T[K]> }>;
type MapToUppercase<T extends string[]> = AsStringArray<{ [K in keyof T]: Uppercase<T[K]> }>;
type MapToCapital<T extends string[]> = AsStringArray<{ [K in keyof T]: Capitalize<T[K]> }>;
type MapToCamel<T extends string[]> = AsStringArray<{ [K in keyof T]: K extends "0" ? Lowercase<T[K]> : PrependIfStartsWithDigit<Capitalize<T[K]>, "_"> }>;
type MapToSentence<T extends string[]> = AsStringArray<{ [K in keyof T]: K extends "0" ? Capitalize<T[K]> : Lowercase<T[K]> }>;
type MapToPascal<T extends string[]> = AsStringArray<{ [K in keyof T]: K extends "0" ? Capitalize<T[K]> : PrependIfStartsWithDigit<Capitalize<T[K]>, "_"> }>;
type MapToOnlyChars<T extends string[], C extends string> = AsStringArray<{ [K in keyof T]: KeepChars<T[K], C> }>;

export type Tokenize<S extends string, D extends string> = _Tokenize<Split<S, "">, D>
type _Tokenize<S extends string[], D extends string, Acc extends string = "", Tokens extends string[] = []> =
  string[] extends S ? string[] :
  // we may have added empty strings to Tokens, but they'll get filtered by SplitStrip
  S extends [] ? [...Tokens, Acc] :
  // in "camelCase" this branch splits to after "camel"
  S extends [infer T extends LowercaseChars, infer U extends UppercaseChars, ...infer Rest extends string[]] ?
    _Tokenize<[U, ...Rest], D, "", [...Tokens, `${Acc}${T}`]> :
  // in "camel200Case" this branch splits after 200
  S extends [infer T extends DigitChars, infer U extends UppercaseChars | LowercaseChars, ...infer Rest extends string[]] ?
    _Tokenize<[U, ...Rest], D, "", [...Tokens, `${Acc}${T}`]> :
  // in "CAMELCase" this branch splits after "CAMEL"
  S extends [infer T extends UppercaseChars, infer U extends UppercaseChars, infer V extends LowercaseChars, ...infer Rest extends string[]] ?
    _Tokenize<[U, V, ...Rest], D, "", [...Tokens, `${Acc}${T}`]> :
  // in "camel_case" this branch splits after "camel" (assuming "_" is in D)
  S extends [D, ...infer Rest extends string[]] ?
    _Tokenize<Rest, D, "", [...Tokens, Acc]> :
  // base case – add the current character to Acc and continue
  S extends [infer T extends string, ...infer Rest extends string[]] ?
    _Tokenize<Rest, D, `${Acc}${T}`, Tokens> :
    never

export type SplitStrip<S extends string, D extends string, C extends string = AlphanumericChars> = WithoutEmpty<MapToOnlyChars<Tokenize<S, D>, C>>;

export type Join<P extends string[], D extends string> = _Join<P, D>;
type _Join<P extends string[], D extends string, J extends string = ""> =
  P extends [] ?
    J :
    P extends [infer First extends string, ...infer Rest extends string[]] ?
      J extends "" ? _Join<Rest, D, First> : _Join<Rest, D, `${J}${D}${First}`> :
      never;

export type Delimiters = "_" | " " | "-" | ".";

type SplitStripCapitalJoin<S extends string, D extends string, J extends string> = Join<MapToCapital<SplitStrip<S, D>>, J>;
type SplitStripLowerJoin<S extends string, D extends string, J extends string> = Join<MapToLowercase<SplitStrip<S, D>>, J>;

export type CapitalCase<S extends string, D extends string = Delimiters> = SplitStripCapitalJoin<S, D, " ">;
export type HeaderCase<S extends string, D extends string = Delimiters> = SplitStripCapitalJoin<S, D, "-">;
export type ParamCase<S extends string, D extends string = Delimiters> = SplitStripLowerJoin<S, D, "-">;
export type DotCase<S extends string, D extends string = Delimiters> = SplitStripLowerJoin<S, D, ".">;
export type SnakeCase<S extends string, D extends string = Delimiters> = SplitStripLowerJoin<S, D, "_">;
export type PathCase<S extends string, D extends string = Delimiters> = SplitStripLowerJoin<S, D, "/">;
export type PascalCase<S extends string, D extends string = Delimiters> = Join<MapToPascal<SplitStrip<S, D>>, "">;
export type CamelCase<S extends string, D extends string = Delimiters> = Join<MapToCamel<SplitStrip<S, D>>, "">;
export type SentenceCase<S extends string, D extends string = Delimiters> = Join<MapToSentence<SplitStrip<S, D>>, " ">;
export type ConstCase<S extends string, D extends string = Delimiters> = Join<MapToUppercase<SplitStrip<S, D>>, "_">;

export namespace ChangeCase {
  export type Capital<S extends string, D extends string = Delimiters> = CapitalCase<S, D>
  export type Header<S extends string, D extends string = Delimiters> = HeaderCase<S, D>
  export type Param<S extends string, D extends string = Delimiters> = ParamCase<S, D>
  export type Dot<S extends string, D extends string = Delimiters> = DotCase<S, D>
  export type Snake<S extends string, D extends string = Delimiters> = SnakeCase<S, D>
  export type Path<S extends string, D extends string = Delimiters> = PathCase<S, D>
  export type Pascal<S extends string, D extends string = Delimiters> = PascalCase<S, D>
  export type Camel<S extends string, D extends string = Delimiters> = CamelCase<S, D>
  export type Sentence<S extends string, D extends string = Delimiters> = SentenceCase<S, D>
  export type Const<S extends string, D extends string = Delimiters> = ConstCase<S, D>
}

// // https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
// // deno-lint-ignore no-explicit-any
// type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;
// // deno-lint-ignore no-explicit-any
// type ToArray<Type> = Type extends any ? Type[] : never;

// type UniqueString<S extends string> =
//   string extends S ?
//     never :
//   ToArrayNonDist<S> extends ToArray<S> ?
//     S :
//   never;

// type SingleChars<S extends string> =
//   S extends "" ?
//     never :
//   S extends `${infer _A}${infer B}` ?
//     B extends "" ?
//       S :
//       never :
//     never;

export type IsLowercase<S extends string> = S extends Lowercase<S> ? S : never;
export type IsUppercase<S extends string> = S extends Uppercase<S> ? S : never;
// export type OnlyChars<S extends string, C extends string> = CharUnion<S> extends CharUnion<C> ? S : never;
// export type OnlySingleChars<S extends string> = [S] extends [SingleChars<S>] ? S : never
