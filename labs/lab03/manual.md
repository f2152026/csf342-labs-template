# F215 Digital Design — Lab 1
## From Gates to Fast Adders in Verilog

This is your first hands-on Verilog lab. You've seen the theory lecture but
have not written or simulated any Verilog yet — that's normal. Every task
below builds directly on the one before it, so work through them in order.

Each task has its own folder (`task1a/`, `task1b/`, `task2/`, ...) containing
the testbench(es) you need and any starter/skeleton code. All testbenches are
provided — you are not required to write your own for this lab. Files marked
**"given — do not modify"** should be left exactly as they are; everything
else contains `TODO` comments marking what you need to fill in.

Some later tasks reuse modules you completed in earlier ones. When a task
needs a file from a previous folder, its skeleton file says so explicitly
("Required file: copy your completed `X.v` from `taskY/` into this folder").
Copy the file forward rather than rewriting it.

---

## Task 1a — Simulate a given full adder

**Folder:** `task1a/`
**Files:** `FA_Gate.v` (given), `task1a_tb.v` (given)

Compile and simulate the provided gate-level full adder against its
testbench, and view the resulting waveform.

**Question:** Confirm that `sum` and `cout` match the full-adder truth table
you already know, at every one of the 8 input combinations the testbench
applies.

---

## Task 1b — Does gate order matter?

**Folder:** `task1b/`
**Files:** `FA_Gate.v` (starter — copy of Task 1a's), `task1b_tb.v` (given)

Reorder the five gate instantiations inside `FA_Gate.v` into any different
sequence (e.g. move the final `or` to the top, the first `xor` to the
bottom). Re-simulate with the same testbench.

**Question:** Does the waveform change? Explain your answer in terms of how
Verilog gate-level statements actually execute — this is the "all
statements execute in parallel, not sequentially" idea from lecture, now
something you've verified yourself rather than just read.

---

## Task 2 — Structural 4-bit ripple-carry adder

**Folder:** `task2/`
**Files:** `FA_Gate.v` (given), `ripple_adder.v` (**skeleton — complete this**), `task2_tb.v` (given)

Complete `ripple_adder.v` by instantiating four `FA_Gate` modules and wiring
them into a ripple-carry chain, following the `TODO` comments and the named
port-connection pattern from lecture. Simulate against the provided
testbench.

**Questions:**
1. Confirm every result in the waveform is arithmetically correct.
2. The testbench includes the input pair 7+1. Find this transition in the
   waveform and identify the internal carry wire(s) that change as a result
   — this is the carry "rippling" through more than one stage.

---

## Task 3 — Adding delays, and finally *seeing* the ripple

**Folder:** `task3/`
**Files:** `FA_Gate.v` (starter), `ripple_adder_delay.v` (**skeleton — complete this**), `task3_tb.v` (given)

Copy `FA_Gate.v` to `FA_Gate_delay.v`, rename the module, and add a small
delay to every gate (e.g. `xor #(2) (ps, a, b);`). Then complete
`ripple_adder_delay.v` using your new delayed full adder, following the same
chaining pattern as Task 2.

Simulate against the provided testbench, which uses wider time gaps than
Task 2's so you have room to observe settling.

**Questions:**
1. Zoom into the waveform around the 7+1 transition and look at the internal
   carries one at a time. You should be able to see each one settle a
   little later than the one before it. Roughly how many gate-delays does it
   take before the final `cout` is stable?
2. Does this match the 2n+1 formula from lecture?

---

## Task 4 — Building faster adders

### Task 4a — 4-bit CLA, gate-level

**Folder:** `task4a/`
**Files:** `CLA4.v` (**skeleton — complete this**), `task4a_tb.v` (given)

Complete `CLA4.v` at the gate level, following the P/G-signal and
direct-carry-equation comments (matching the lecture circuit and Tutorial 3
exactly). Simulate against the provided testbench — it uses the same
stimulus as Task 2's, so you can sanity-check your CLA4 and your
`ripple_adder` agree on every result.

**Reflection (no code):** would this hand-instantiated, gate-by-gate
approach still be reasonable if you needed a 64-bit CLA? Concretely, how
many literals would the AND term feeding the final carry need?

### Task 4b — The same circuit, with `assign`

**Folder:** `task4b/`
**Files:** `CLA4_dataflow.v` (**skeleton — complete this**), `task4b_tb.v` (given)

Rebuild the identical 4-bit CLA using dataflow modeling (`assign` statements)
instead of gate primitives, following the `TODO` comments. Simulate against
the provided testbench (same stimulus as 4a).

**Question:** Compare `CLA4.v` and `CLA4_dataflow.v` side by side — line
count, readability, how directly each line maps to the Boolean equation it
implements. Which would you rather maintain or debug six months from now?

### Task 4c — A flat 64-bit CLA

**Folder:** `task4c/`
**Files:** `CLA64_flat.v` (**skeleton — complete this**), `task4c_tb.v` (given)

This file extends the same idea to all 64 bits, in two very different ways:

- **P and G** are computed with a `generate`-`for` loop (already written for
  you, and explained in the file's comments) — this part is genuinely
  uniform across all 64 bits, so a loop is the right tool.
- **The 64 carry equations** are *not* uniform — each one has a different,
  growing number of terms. Writing them by hand would be extremely tedious,
  and a simple loop can't produce them directly. Instead, follow the
  in-file instructions to use an AI coding assistant to generate these 64
  `assign` statements from your own C1–C4 equations as the pattern — **and
  then verify the result yourself** before trusting it (check C1–C4 match
  your own derivation exactly, then re-derive at least one later equation,
  e.g. C10 or C32, by hand and confirm it matches).

Simulate against the provided testbench and confirm correctness.

**Reflection:** open your own `c[64]` line and count the literals in its
largest product term. Given that real logic gates rarely exceed 4–8 inputs,
is this circuit realistically buildable in hardware — even though it just
simulated correctly?

### Task 4d — A practical 64-bit CLA

**Folder:** `task4d/`
**Files:** `CLA64_blocked.v` (**skeleton — complete this**), `task4d_tb.v` (given)
**Required:** copy your completed `CLA4.v` (or `CLA4_dataflow.v`) from Task 4a/4b into this folder.

Complete `CLA64_blocked.v` by instantiating sixteen of your 4-bit CLA blocks
and chaining their carries block-to-block — the same instantiate-and-chain
pattern as Task 2's ripple adder, just with CLA blocks instead of single
full adders. Simulate against the provided testbench.

### Task 4e — Three-way comparison

**Folder:** `task4e/`
**Files:** `RCA64.v` (**skeleton — complete this**), `task4e_tb.v` (given)
**Required:** copy your completed `CLA64_flat.v` (4c), `CLA64_blocked.v` + its `CLA4` dependency (4d), and `FA_Gate_delay.v` (3) into this folder.

Complete `RCA64.v` — a plain 64-bit ripple-carry adder, chaining 64
`FA_Gate_delay` instances (a `generate`-`for` loop is a reasonable way to
write this one, since every stage is structurally identical). The provided
testbench instantiates all three of your 64-bit adders — `RCA64`,
`CLA64_flat`, `CLA64_blocked` — side by side on identical inputs.

**Questions:**
1. Using the waveform, compare how much earlier the two CLA-based adders'
   final sums settle, compared to `RCA64`.
2. Does the speedup roughly match Tutorial 3's predicted numbers?
3. `CLA64_flat` and `CLA64_blocked` should perform similarly *in this
   simulation*. Given that, why would a real chip still use the Task 4d
   design over the Task 4c one?

---

## Task 5 (Bonus) — The O(log n) adder

**Folder:** `task5/`
**Files:** `CLA64_hier.v` (**open-ended — no detailed skeleton**), `task5_tb.v` (given)
**Required:** copy your completed `CLA64_blocked.v` and its `CLA4` dependency from Task 4d into this folder.

Apply the same generate/propagate trick to the 16 blocks from Task 4d
*themselves*, building a second-level lookahead unit that computes each
block's carry-in directly, instead of rippling block to block — the scheme
from Tutorial 3, Q4(d). See the comments in `CLA64_hier.v` for a starting
point; the rest of the design is up to you.

**Question:** Simulate against the provided testbench and compare your
final delay to Task 4d's `CLA64_blocked`.
