// task4e_tb.v
// Compares RCA64, CLA64_flat, and CLA64_blocked side by side on identical
// inputs. This file is given -- do not modify it.
//
// Required files: copy your completed CLA64_flat.v (Task 4c),
// CLA64_blocked.v + its CLA4 dependency (Task 4d), and RCA64.v's
// dependency FA_Gate_delay.v (Task 3) into this folder before compiling.

module task4e_tb;
  reg  [63:0] t_a, t_b;
  reg         t_cin;

  wire [63:0] rca_sum, flat_sum, blocked_sum;
  wire        rca_cout, flat_cout, blocked_cout;

  RCA64         U_RCA      (.a(t_a), .b(t_b), .cin(t_cin), .sum(rca_sum),     .cout(rca_cout));
  CLA64_flat    U_FLAT     (.a(t_a), .b(t_b), .cin(t_cin), .sum(flat_sum),    .cout(flat_cout));
  CLA64_blocked U_BLOCKED  (.a(t_a), .b(t_b), .cin(t_cin), .sum(blocked_sum), .cout(blocked_cout));

  initial begin
    $dumpfile("task4e.vcd");
    $dumpvars(0, task4e_tb);
  end

  initial begin
    t_a = 64'd0; t_b = 64'd0; t_cin = 0;
    #30 t_a = 64'hFFFFFFFF_FFFFFFFF; t_b = 64'd1; t_cin = 0;   // worst-case ripple for RCA64
    #30 t_a = 64'd123456789; t_b = 64'd987654321; t_cin = 0;
    #30 $finish;
  end

  initial
    $monitor($time,
      " RCA: sum=%h cout=%b | FLAT-CLA: sum=%h cout=%b | BLOCKED-CLA: sum=%h cout=%b",
      rca_sum, rca_cout, flat_sum, flat_cout, blocked_sum, blocked_cout);

endmodule
