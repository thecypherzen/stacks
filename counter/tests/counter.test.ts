import { describe, expect, it } from "vitest";
import { Cl, cvToValue } from "@stacks/transactions";

const accounts = simnet.getAccounts();

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/stacks/clarinet-js-sdk
*/

describe("Test Counter Smart Contract", () => {
  it("Test init: Ensure simnet is well initialised", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("Test `get-count` function. validate it returns u0 for principals who have never called it", () => {
    const deployer = accounts.get("deployer");
    expect(deployer).toBeDefined();
    const { result } = simnet.callReadOnlyFn(
      "counter",
      "get-count",
      [Cl.standardPrincipal(deployer!)],
      deployer!
    );
    expect(result).toBeUint(0);
  });

  it("Test `increase` function. Validate it increases by one for each call", () => {
    const deployer = accounts.get("deployer");
    if (deployer === undefined) {
      throw new Error("Principal undefined");
    }
    // get initial count for principal
    const { result: initCount } = simnet.callReadOnlyFn(
      "counter",
      "get-count",
      [Cl.standardPrincipal(deployer)],
      deployer
    );
    const initValue = parseInt(cvToValue(initCount));

    // call increase to update count for current caller
    const { result: increased } = simnet.callPublicFn(
      "counter",
      "increase",
      [],
      deployer
    );
    expect(increased).toBeOk(Cl.bool(true));

    // validate increment is by one as expected
    const { result: newCount } = simnet.callReadOnlyFn(
      "counter",
      "get-count",
      [Cl.standardPrincipal(deployer)],
      deployer
    );
    const newValue = parseInt(cvToValue(newCount));
    expect(newValue).toBe(initValue + 1);
  });

  it("Multiplayer test", () => {
    // get principals
    const deployer = accounts.get("deployer");
    const wallet1 = accounts.get("wallet_1");
    const wallet2 = accounts.get("wallet_2");
    const wallet3 = accounts.get("wallet_3");

    // validate principals
    [deployer, wallet1, wallet2, wallet3].forEach((w) => {
      expect(w).toBeDefined();
    });

    // initial balance of each wallet
    const w1InitCount = parseInt(
      cvToValue(
        simnet.callReadOnlyFn(
          "counter",
          "get-count",
          [Cl.standardPrincipal(wallet1!)],
          deployer!
        ).result
      )
    );
    const w2InitCount = parseInt(
      cvToValue(
        simnet.callReadOnlyFn(
          "counter",
          "get-count",
          [Cl.standardPrincipal(wallet2!)],
          deployer!
        ).result
      )
    );
    const w3InitCount = parseInt(
      cvToValue(
        simnet.callReadOnlyFn(
          "counter",
          "get-count",
          [Cl.standardPrincipal(wallet3!)],
          deployer!
        ).result
      )
    );
    const userInitCount = parseInt(
      cvToValue(
        simnet.callReadOnlyFn(
          "counter",
          "get-count",
          [Cl.standardPrincipal(deployer!)],
          deployer!
        ).result
      )
    );

    const increments = [
      // increase wallet1 once
      simnet.callPublicFn("counter", "increase", [], wallet1!),
      // increase wallet2 twice
      simnet.callPublicFn("counter", "increase", [], wallet2!),
      simnet.callPublicFn("counter", "increase", [], wallet2!),
      // increase wallet3 thrice
      simnet.callPublicFn("counter", "increase", [], wallet3!),
      simnet.callPublicFn("counter", "increase", [], wallet3!),
      simnet.callPublicFn("counter", "increase", [], wallet3!),
    ];

    // validate all increments were successful
    increments.forEach((v) => {
      expect(v.result).toBeOk(Cl.bool(true));
    });

    // get updated counts for each wallet
    const w1NewCount = parseInt(
      cvToValue(
        simnet.callReadOnlyFn(
          "counter",
          "get-count",
          [Cl.standardPrincipal(wallet1!)],
          deployer!
        ).result
      )
    );
    const w2NewCount = parseInt(
      cvToValue(
        simnet.callReadOnlyFn(
          "counter",
          "get-count",
          [Cl.standardPrincipal(wallet2!)],
          deployer!
        ).result
      )
    );
    const w3NewCount = parseInt(
      cvToValue(
        simnet.callReadOnlyFn(
          "counter",
          "get-count",
          [Cl.standardPrincipal(wallet3!)],
          deployer!
        ).result
      )
    );
    const userNewCount = parseInt(
      cvToValue(
        simnet.callReadOnlyFn(
          "counter",
          "get-count",
          [Cl.standardPrincipal(deployer!)],
          deployer!
        ).result
      )
    );
    // run update validations
    expect(w1NewCount).toBe(w1InitCount + 1);
    expect(w2NewCount).toBe(w2InitCount + 2);
    expect(w3NewCount).toBe(w3InitCount + 3);
    expect(userNewCount).toBe(userInitCount);
  });
});
