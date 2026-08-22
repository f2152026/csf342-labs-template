// task2_tb.v
// Testbench for ripple_adder. This file is given -- do not modify it.
// Note the second stimulus vector (7+1): this deliberately makes the carry
// ripple through all three internal carry wires (c1, c2, c3).

module task2_tb;
  reg  [3:0] t_a, t_b;
  reg        t_cin;
  wire [3:0] t_sum;
  wire       t_cout;

  ripple_adder DUT (
    .a    (t_a),
    .b    (t_b),
    .cin  (t_cin),
    .sum  (t_sum),
    .cout (t_cout)
  );

  initial begin
    $dumpfile("task2.vcd");
    $dumpvars(0, task2_tb);
  end

  initial begin
    t_a = 4'b0000; t_b = 4'b0000; t_cin = 0;              // 0 + 0       = 0
    #10 t_a = 4'b0001; t_b = 4'b0001; t_cin = 0;          // 1 + 1       = 2
    #10 t_a = 4'b0111; t_b = 4'b0001; t_cin = 0;          // 7 + 1       = 8  (carry ripples through c1,c2,c3)
    #10 t_a = 4'b1111; t_b = 4'b0001; t_cin = 0;          // 15 + 1      = 16 -> sum=0000, cout=1
    #10 t_a = 4'b0101; t_b = 4'b0011; t_cin = 1;          // 5 + 3 + 1   = 9
    #10 t_a = 4'b1010; t_b = 4'b0101; t_cin = 0;          // 10 + 5      = 15
    #10 $finish;
  end

  initial
    $monitor($time, " a=%b b=%b cin=%b | sum=%b cout=%b", t_a, t_b, t_cin, t_sum, t_cout);

endmodule
