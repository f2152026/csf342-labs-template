// task4d_tb.v
// Testbench for CLA64_blocked. This file is given -- do not modify it.

module task4d_tb;
  reg  [63:0] t_a, t_b;
  reg         t_cin;
  wire [63:0] t_sum;
  wire        t_cout;

  CLA64_blocked DUT (
    .a    (t_a),
    .b    (t_b),
    .cin  (t_cin),
    .sum  (t_sum),
    .cout (t_cout)
  );

  initial begin
    $dumpfile("task4d.vcd");
    $dumpvars(0, task4d_tb);
  end

  initial begin
    t_a = 64'd0; t_b = 64'd0; t_cin = 0;
    #10 t_a = 64'd1; t_b = 64'd1; t_cin = 0;
    #10 t_a = 64'hFFFFFFFF_FFFFFFFF; t_b = 64'd1; t_cin = 0;         // ripples through all 64 bits
    #10 t_a = 64'h0F0F0F0F_0F0F0F0F; t_b = 64'hF0F0F0F0_F0F0F0F0; t_cin = 1;
    #10 t_a = 64'd123456789; t_b = 64'd987654321; t_cin = 0;
    #10 $finish;
  end

  initial
    $monitor($time, " a=%h b=%h cin=%b | sum=%h cout=%b", t_a, t_b, t_cin, t_sum, t_cout);

endmodule
