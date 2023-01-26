import * as cc from "npm:change-case";
import { ChangeCase as CC, changeCase as ccTyped } from "./mod.ts";
import { assertEquals } from "https://deno.land/std@0.173.0/testing/asserts.ts";

type TestCases = [
  "",
  "test",
  "test string",
  "Test String",
  "TestV2",
  "version 1.2.10",
  "version 1.21.0",
  "some TERRIBLE2ERRORCondition___HOWSad",
];
const testCases: TestCases = [
  "",
  "test",
  "test string",
  "Test String",
  "TestV2",
  "version 1.2.10",
  "version 1.21.0",
  "some TERRIBLE2ERRORCondition___HOWSad",
];

type SnakeTestCases<T extends TestCases = TestCases> = { [K in keyof T]: CC.Snake<T[K]> }
const SnakeTests: SnakeTestCases = [
  "",
  "test",
  "test_string",
  "test_string",
  "test_v2",
  "version_1_2_10",
  "version_1_21_0",
  "some_terrible2_error_condition_how_sad",
];

type CamelTestCases<T extends TestCases = TestCases> = { [K in keyof T]: CC.Camel<T[K]> }
const CamelTests: CamelTestCases = [
  "",
  "test",
  "testString",
  "testString",
  "testV2",
  "version_1_2_10",
  "version_1_21_0",
  "someTerrible2ErrorConditionHowSad",
]

type PascalTestCases<T extends TestCases = TestCases> = { [K in keyof T]: CC.Pascal<T[K]> }
const PascalTests: PascalTestCases = [
  "",
  "Test",
  "TestString",
  "TestString",
  "TestV2",
  "Version_1_2_10",
  "Version_1_21_0",
  "SomeTerrible2ErrorConditionHowSad",
];

type ConstTestCases<T extends TestCases = TestCases> = { [K in keyof T]: CC.Const<T[K]> }
const ConstTests: ConstTestCases = [
  "",
  "TEST",
  "TEST_STRING",
  "TEST_STRING",
  "TEST_V2",
  "VERSION_1_2_10",
  "VERSION_1_21_0",
  "SOME_TERRIBLE2_ERROR_CONDITION_HOW_SAD",
];

type ParamTestCases<T extends TestCases = TestCases> = { [K in keyof T]: CC.Param<T[K]> }
const ParamTests: ParamTestCases = [
  "",
  "test",
  "test-string",
  "test-string",
  "test-v2",
  "version-1-2-10",
  "version-1-21-0",
  "some-terrible2-error-condition-how-sad",
]

type DotTestCases<T extends TestCases = TestCases> = { [K in keyof T]: CC.Dot<T[K]> }
const DotTests: DotTestCases = [
  "",
  "test",
  "test.string",
  "test.string",
  "test.v2",
  "version.1.2.10",
  "version.1.21.0",
  "some.terrible2.error.condition.how.sad",
]

type SentenceTestCases<T extends TestCases = TestCases> = { [K in keyof T]: CC.Sentence<T[K]> }
const SentenceTests: SentenceTestCases = [
  "",
  "Test",
  "Test string",
  "Test string",
  "Test v2",
  "Version 1 2 10",
  "Version 1 21 0",
  "Some terrible2 error condition how sad",
]

type HeaderTestCases<T extends TestCases = TestCases> = { [K in keyof T]: CC.Header<T[K]> }
const HeaderTests: HeaderTestCases = [
  "",
  "Test",
  "Test-String",
  "Test-String",
  "Test-V2",
  "Version-1-2-10",
  "Version-1-21-0",
  "Some-Terrible2-Error-Condition-How-Sad",
]

type CapitalTestCases<T extends TestCases = TestCases> = { [K in keyof T]: CC.Capital<T[K]> }
const CapitalTests: CapitalTestCases = [
  "",
  "Test",
  "Test String",
  "Test String",
  "Test V2",
  "Version 1 2 10",
  "Version 1 21 0",
  "Some Terrible2 Error Condition How Sad",
]

type PathTestCases<T extends TestCases = TestCases> = { [K in keyof T]: CC.Path<T[K]> }
const PathTests: PathTestCases = [
  "",
  "test",
  "test/string",
  "test/string",
  "test/v2",
  "version/1/2/10",
  "version/1/21/0",
  "some/terrible2/error/condition/how/sad",
]

type StringConv = (s: string) => string;
type AnyTestCase = [string, string, string, string, string, string, string, string]
type VoidFn<A = void> = (a: A) => void;

type TestResult = {
  count: number;
  errors: Error[]
}

class Tester {
  readonly name: string
  private readonly assertions: Array<VoidFn> = []
  constructor (name: string) {
    this.name = name;
  }

  test(f: VoidFn) {
    this.assertions.push(f)
  }

  f(): VoidFn<VoidFn> {
    return f => this.test(f)
  }

  run(): TestResult {
    const errors: Error[] = [];
    const count = this.assertions.length;
    for (const t of this.assertions) {
      try {
        t();
      } catch (err) {
        errors.push(err as Error)
      }
    }
    return { errors, count }
  }
}

const tests: Tester[] = [];

function test (title: string, fn: VoidFn<VoidFn<VoidFn>>) {
  const tc = new Tester(title);
  fn(tc.f());
  tests.push(tc);
}

// this ensures the typesafe values declared above match the runtime return type of the change-case functions
function testTypes<T extends AnyTestCase> (name: string, convs: T, f: (s: string) => string) {
  test(`types: ${name}`, t => {
    for (const [idx, conv] of convs.entries()) {
      t(() => assertEquals(conv, f(testCases[idx])))
    }
  });
}

// this ensures the typed change-case functions delegate to the correct original change-case functions
function testConversion<F extends StringConv> (name: string, originalFn: StringConv, typedFn: F) {
  test(`typed fns: ${name}`, t => {
    for (const str of testCases) {
      t(() => assertEquals(originalFn(str), typedFn(str)));
    }
  });
}

testTypes("Snake case", SnakeTests, cc.snakeCase);
testTypes("Camel case", CamelTests, cc.camelCase);
testTypes("Param case", ParamTests, cc.paramCase);
testTypes("Pascal calse", PascalTests, cc.pascalCase);
testTypes("Const case", ConstTests, cc.constantCase);
testTypes("Dot case", DotTests, cc.dotCase);
testTypes("Sentence case", SentenceTests, cc.sentenceCase);
testTypes("Header case", HeaderTests, cc.headerCase);
testTypes("Capital case", CapitalTests, cc.capitalCase);
testTypes("Path case", PathTests, cc.pathCase);

testConversion("Snake case", cc.snakeCase, ccTyped.snakeCase);
testConversion("Camel case", cc.camelCase, ccTyped.camelCase);
testConversion("Param case", cc.paramCase, ccTyped.paramCase);
testConversion("Pascal calse", cc.pascalCase, ccTyped.pascalCase);
testConversion("Const case", cc.constantCase, ccTyped.constantCase);
testConversion("Dot case", cc.dotCase, ccTyped.dotCase);
testConversion("Sentence case", cc.sentenceCase, ccTyped.sentenceCase);
testConversion("Header case", cc.headerCase, ccTyped.headerCase);
testConversion("Capital case", cc.capitalCase, ccTyped.capitalCase);
testConversion("Path case", cc.pathCase, ccTyped.pathCase);

let passed = 0;
let failed = 0;
const total = tests.length;

for (const [idx, tc] of tests.entries()) {
  const { errors, count } = tc.run();
  if (errors.length) {
    console.log(idx, "FAIL", tc.name, `(${errors.length} / ${count} assertions failed)`)
    for (const err of errors) {
      console.error(err);
    }
    failed += 1;
  } else {
    console.log(idx, "OK", tc.name, `(${count} assertions)`)
    passed += 1;
  }
}

console.log(total, "tests");
console.log(passed, "passed");
console.log(failed, "failed");
if (failed > 0) Deno.exit(1);