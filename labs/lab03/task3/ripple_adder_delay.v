// ripple_adder_delay.v
// Same structure as Task 2's ripple_adder, but built from FA_Gate_delay
// (the delayed full adder you create in this task) instead of FA_Gate.
//
// TODO:
//   1. Copy FA_Gate.v in this folder to FA_Gate_delay.v, rename the module
//      to FA_Gate_delay, and add a small delay to every gate, e.g.:
//        xor #(2) (ps,  a,   b);
//        and #(2) (pc1, a,   b);
//        xor #(2) (sum, cin, ps);
//        and #(2) (pc2, cin, ps);
//        or  #(2) (cout, pc1, pc2);
//   2. Instantiate four FA_Gate_delay modules below, wired exactly like
//      Task 2's ripple_adder (same carry-chain pattern).

module ripple_adder_delay(
  input  [3:0] a,
  input  [3:0] b,
  input        cin,
  output [3:0] sum,
  output       cout
);

  wire c1, c2, c3;

  // TODO: your four FA_Gate_delay instances go here.

endmodule
