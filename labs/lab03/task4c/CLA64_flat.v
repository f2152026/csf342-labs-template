// CLA64_flat.v
// A flat, unblocked 64-bit carry-lookahead adder: every carry is computed
// directly (two-level, no rippling), exactly like CLA4, just scaled to 64
// bits.

module CLA64_flat(
  input  [63:0] a,
  input  [63:0] b,
  input         cin,
  output [63:0] sum,
  output        cout
);

  wire [63:0] p, g;
  wire [64:1] c;   // c[1]..c[64] are the 64 carries; think of cin as c[0]

  // ---------------------------------------------------------------------
  // Step 1: generate/propagate signals -- WORKED EXAMPLE
  //
  // This part is genuinely uniform across all 64 bits (same operation at
  // every position), so a generate-for loop is the right tool here.
  // `genvar` is a compile-time-only loop variable -- it does not exist as
  // a real signal in the final circuit, it just controls how many times
  // the loop body is elaborated.
  // ---------------------------------------------------------------------
  genvar i;
  generate
    for (i = 0; i < 64; i = i + 1) begin : gen_pg
      xor (p[i], a[i], b[i]);
      and (g[i], a[i], b[i]);
    end
  endgenerate

  // ---------------------------------------------------------------------
  // Step 2: the 64 direct carry equations -- YOUR TASK
  //
  // Unlike P and G, these are NOT uniform: Ck needs k+1 product terms,
  // each one literal longer than the last (see Tutorial 3's derivation).
  // Writing all 64 of these by hand is extremely tedious and error-prone,
  // and a single generate-for loop cannot produce them directly (both the
  // number of terms AND the length of each term change with k).
  //
  // Instead: use an AI coding assistant to generate these 64 `assign`
  // statements.
  //   - Give it your own C1..C4 equations from Task 4a/4b as the exact
  //     pattern to continue.
  //   - Ask it to produce assign statements for c[1] through c[64]
  //     following that same pattern.
  //
  // YOU are responsible for verifying the result before trusting it --
  // this is not optional:
  //   (1) Confirm the generated c[1]..c[4] exactly match your own Task 4a/4b
  //       equations.
  //   (2) Pick at least one later equation (e.g. c[10] or c[32]), re-derive
  //       it yourself by hand from the recursive definition, and confirm
  //       it matches what was generated.
  // Do not move on to Task 4c's reflection question until you've done both
  // checks.
  //
  // TODO: paste your verified assign statements for c[1] through c[64] here.

  assign cout = c[64];

  // ---------------------------------------------------------------------
  // Step 3: sum bits
  // ---------------------------------------------------------------------
  // TODO: assign sum = p ^ {c[63:1], cin};

endmodule
