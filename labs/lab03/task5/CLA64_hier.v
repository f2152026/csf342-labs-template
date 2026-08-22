// CLA64_hier.v
// BONUS -- open-ended. No detailed scaffold is provided; this is meant to
// be a genuine design exercise.
//
// Required file: copy your completed CLA4.v (Task 4a/4b) into this folder.
// You will likely need to modify it (or add signals alongside it) so that
// its own Gi, Pi signals -- or a block-generate/block-propagate summary of
// them -- are exposed as outputs, since the second-level lookahead unit
// below needs them.
//
// Starting point (from Tutorial 3, Q4(d)):
//   - Reuse your 16 four-bit CLA blocks -- their internal logic doesn't
//     change.
//   - For each block k, define:
//       Gblk_k = "this block produces a carry regardless of its incoming
//                 carry" -- a Boolean function of that block's own 4
//                 bit-level Gi, Pi signals.
//       Pblk_k = "an incoming carry sails straight through this whole
//                 block" -- likewise a function of its own Gi, Pi.
//   - Build a second-level lookahead unit -- structurally identical to
//     your Task 4a/4b 4-bit CLA, just one level up -- that computes each
//     block's carry-in directly from Gblk_0..Gblk_15, Pblk_0..Pblk_15, and
//     cin, instead of rippling block to block.
//
// Compare your final delay (via waveform) to Task 4d's CLA64_blocked.

module CLA64_hier(
  input  [63:0] a,
  input  [63:0] b,
  input         cin,
  output [63:0] sum,
  output        cout
);

  // TODO: your hierarchical design goes here.

endmodule
