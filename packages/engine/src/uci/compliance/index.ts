export interface IUCIComplianceSuite {
  /**
   * Parses the given test data transcript line by line and ensures
   * the parser doesn't crash or throw unexpected exceptions.
   */
  verifyParserResilience(transcriptPath: string): Promise<void>;

  /**
   * Validates that the parser extracts the correct options during negotiation.
   */
  verifyOptionNegotiation(transcriptPath: string): Promise<void>;

  /**
   * Reads a MultiPV transcript and asserts the pv streams are ordered correctly
   * and replace existing streams appropriately.
   */
  verifyMultiPv(transcriptPath: string): Promise<void>;

  /**
   * Fast-check fuzzes the parser with random data for thousands of iterations.
   */
  verifyFuzzResilience(iterations: number): Promise<void>;

  /**
   * Ensure the protocol parser covers 100% of the spec features.
   */
  verifyProtocolCoverage(): Promise<boolean>;

  /**
   * Simulates thousands of sequential position/go/stop commands to test memory and state.
   */
  verifyLongSession(commands: number): Promise<void>;

  /**
   * Simulates many virtual engine sessions communicating in parallel.
   */
  verifyStressConcurrency(sessions: number): Promise<void>;
}
