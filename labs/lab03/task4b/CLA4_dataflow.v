// CLA4_dataflow.v
// The same 4-bit CLA as Task 4a, rewritten using dataflow modeling
// (continuous `assign` statements) instead of gate primitives.
// Compare the line count and readability of this file to CLA4.v.
//
// TODO:
//   assign p = a ^ b;
//   assign g = a & b;
//   assign c1   = g[0] | (p[0] & cin);
//   assign c2   = g[1] | (p[1] & g[0]) | (p[1] & p[0] & cin);
//   assign c3   = ... (same pattern, one more term)
//   assign cout = ... (same pattern, one more term)
//   assign sum  = p ^ {c3, c2, c1, cin};

module CLA4_dataflow(
  input  [3:0] a,
  input  [3:0] b,
  input        cin,
  output [3:0] sum,
  output       cout
);

  wire [3:0] p, g;
  wire c1, c2, c3;

  // TODO: your dataflow (assign) statements go here.

endmodule
