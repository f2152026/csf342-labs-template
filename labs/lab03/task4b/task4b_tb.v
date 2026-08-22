// task4b_tb.v
// Testbench for CLA4_dataflow. This file is given -- do not modify it.
// Uses the same stimulus as Task 2's testbench, so you can sanity-check
// that CLA4_dataflow and ripple_adder agree on every result.

module task4b_tb;
  reg  [3:0] t_a, t_b;
  reg        t_cin;
  wire [3:0] t_sum;
  wire       t_cout;

  CLA4_dataflow DUT (
    .a    (t_a),
    .b    (t_b),
    .cin  (t_cin),
    .sum  (t_sum),
    .cout (t_cout)
  );

  initial begin
    $dumpfile("task4b.vcd");
    $dumpvars(0, task4b_tb);
  end

  initial begin
    t_a = 4'b0000; t_b = 4'b0000; t_cin = 0;
    #10 t_a = 4'b0001; t_b = 4'b0001; t_cin = 0;
    #10 t_a = 4'b0111; t_b = 4'b0001; t_cin = 0;
    #10 t_a = 4'b1111; t_b = 4'b0001; t_cin = 0;
    #10 t_a = 4'b0101; t_b = 4'b0011; t_cin = 1;
    #10 t_a = 4'b1010; t_b = 4'b0101; t_cin = 0;
    #10 $finish;
  end

  initial
    $monitor($time, " a=%b b=%b cin=%b | sum=%b cout=%b", t_a, t_b, t_cin, t_sum, t_cout);

endmodule
