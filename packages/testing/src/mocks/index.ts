// This directory is strictly for mocking 3rd party boundaries.
// Example: MockHttpClient
export class MockHttpClient {
  public requests: Array<{ url: string; method: string }> = [];

  async get(url: string) {
    this.requests.push({ url, method: 'GET' });
    return { status: 200, data: {} };
  }
}
