// task3_tb.v
// Testbench for ripple_adder_delay. This file is given -- do not modify it.
// Time gaps are wider than Task 2's so you have room to see each stage's
// carry settle before the next input change. Zoom into the waveform around
// each transition and look at the internal carries (c1, c2, c3) one at a
// time -- they should each become stable a little later than the one before.

module task3_tb;
  reg  [3:0] t_a, t_b;
  reg        t_cin;
  wire [3:0] t_sum;
  wire       t_cout;

  ripple_adder_delay DUT (
    .a    (t_a),
    .b    (t_b),
    .cin  (t_cin),
    .sum  (t_sum),
    .cout (t_cout)
  );

  initial begin
    $dumpfile("task3.vcd");
    $dumpvars(0, task3_tb);
  end

  initial begin
    t_a = 4'b0000; t_b = 4'b0000; t_cin = 0;
    #20 t_a = 4'b0111; t_b = 4'b0001; t_cin = 0;   // worst-case ripple: carry crosses all 4 stages
    #20 t_a = 4'b1111; t_b = 4'b0001; t_cin = 0;
    #20 $finish;
  end

  initial
    $monitor($time, " a=%b b=%b cin=%b | sum=%b cout=%b", t_a, t_b, t_cin, t_sum, t_cout);

endmodule
