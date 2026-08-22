// FA_Gate.v
// Gate-level model of a 1-bit full adder.
// This file is given -- do not modify it for Task 1a.

module FA_Gate(
  input  a,
  input  b,
  input  cin,
  output sum,
  output cout
);
  wire ps, pc1, pc2;

  xor (ps,  a,   b);
  and (pc1, a,   b);
  xor (sum, cin, ps);
  and (pc2, cin, ps);
  or  (cout, pc1, pc2);

endmodule
