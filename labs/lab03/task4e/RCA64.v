// RCA64.v
// A plain 64-bit ripple-carry adder, for comparison against your Task 4c
// and 4d CLA designs.
//
// Required file: copy your completed FA_Gate_delay.v (from Task 3) into
// this folder before compiling.
//
// TODO: instantiate 64 FA_Gate_delay modules, chained exactly like Task
// 2's 4-bit ripple adder, just 64 bits wide. This is very repetitive --
// a generate-for loop is a reasonable way to write this one, since every
// stage is structurally identical (unlike Task 4c's carry equations).

module RCA64(
  input  [63:0] a,
  input  [63:0] b,
  input         cin,
  output [63:0] sum,
  output        cout
);

  wire [63:1] c;   // carries BETWEEN stages: c[1]..c[63]

  // TODO: your 64 FA_Gate_delay instances go here.

endmodule
