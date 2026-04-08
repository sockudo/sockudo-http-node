const expect = require("expect.js");
const nock = require("nock");

const Sockudo = require("../../../dist/sockudo");

describe("Sockudo", function () {
  let sockudo;

  beforeEach(function () {
    sockudo = new Sockudo({ appId: 999, key: "111111", secret: "tofu" });
    nock.disableNetConnect();
  });

  afterEach(function () {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe("#get", function () {
    it("should set the correct path and include all params", function (done) {
      nock("http://localhost")
        .filteringPath(function (path) {
          return path
            .replace(/auth_timestamp=[0-9]+/, "auth_timestamp=X")
            .replace(/auth_signature=[0-9a-f]{64}/, "auth_signature=Y");
        })
        .get(
          "/apps/999/channels?auth_key=111111&auth_timestamp=X&auth_version=1.0&filter_by_prefix=presence-&info=user_count,subscription_count&auth_signature=Y",
        )
        .reply(200, "{}");

      sockudo
        .get({
          path: "/channels",
          params: {
            filter_by_prefix: "presence-",
            info: "user_count,subscription_count",
          },
        })
        .then(() => done())
        .catch(done);
    });

    it("should resolve to the response", function (done) {
      nock("http://localhost")
        .filteringPath(function (path) {
          return path
            .replace(/auth_timestamp=[0-9]+/, "auth_timestamp=X")
            .replace(/auth_signature=[0-9a-f]{64}/, "auth_signature=Y");
        })
        .get(
          "/apps/999/test?auth_key=111111&auth_timestamp=X&auth_version=1.0&auth_signature=Y",
        )
        .reply(200, '{"test key": "test value"}');

      sockudo
        .get({ path: "/test", params: {} })
        .then((response) => {
          expect(response.status).to.equal(200);
          return response.text().then((body) => {
            expect(body).to.equal('{"test key": "test value"}');
            done();
          });
        })
        .catch(done);
    });

    it("should reject with a RequestError if Sockudo responds with 4xx", function (done) {
      nock("http://localhost")
        .filteringPath(function (path) {
          return path
            .replace(/auth_timestamp=[0-9]+/, "auth_timestamp=X")
            .replace(/auth_signature=[0-9a-f]{64}/, "auth_signature=Y");
        })
        .get(
          "/apps/999/test?auth_key=111111&auth_timestamp=X&auth_version=1.0&auth_signature=Y",
        )
        .reply(400, "Error");

      sockudo.get({ path: "/test", params: {} }).catch((error) => {
        expect(error).to.be.a(Sockudo.RequestError);
        expect(error.message).to.equal("Unexpected status code 400");
        expect(error.url).to.match(
          /^http:\/\/localhost\/apps\/999\/test\?auth_key=111111&auth_timestamp=[0-9]+&auth_version=1\.0&auth_signature=[a-f0-9]+$/,
        );
        expect(error.status).to.equal(400);
        expect(error.body).to.equal("Error");
        done();
      });
    });

    it("should respect the encryption, host and port config", function (done) {
      const sockudo = new Sockudo({
        appId: 999,
        key: "111111",
        secret: "tofu",
        useTLS: true,
        host: "example.com",
        port: 1234,
      });
      nock("https://example.com:1234")
        .filteringPath(function (path) {
          return path
            .replace(/auth_timestamp=[0-9]+/, "auth_timestamp=X")
            .replace(/auth_signature=[0-9a-f]{64}/, "auth_signature=Y");
        })
        .get(
          "/apps/999/test?auth_key=111111&auth_timestamp=X&auth_version=1.0&auth_signature=Y",
        )
        .reply(200, '{"test key": "test value"}');

      sockudo
        .get({ path: "/test", params: {} })
        .then(() => done())
        .catch(done);
    });

    it("should respect the timeout when specified", function (done) {
      const sockudo = new Sockudo({
        appId: 999,
        key: "111111",
        secret: "tofu",
        timeout: 100,
      });
      nock("http://localhost")
        .filteringPath(function (path) {
          return path
            .replace(/auth_timestamp=[0-9]+/, "auth_timestamp=X")
            .replace(/auth_signature=[0-9a-f]{64}/, "auth_signature=Y");
        })
        .get(
          "/apps/999/test?auth_key=111111&auth_timestamp=X&auth_version=1.0&auth_signature=Y",
        )
        .delayConnection(101)
        .reply(200);

      sockudo.get({ path: "/test", params: {} }).catch((error) => {
        expect(error).to.be.a(Sockudo.RequestError);
        expect(error.message).to.equal("Request failed with an error");
        expect(error.error.name).to.eql("AbortError");
        expect(error.url).to.match(
          /^http:\/\/localhost\/apps\/999\/test\?auth_key=111111&auth_timestamp=[0-9]+&auth_version=1\.0&auth_signature=[a-f0-9]+$/,
        );
        expect(error.status).to.equal(undefined);
        expect(error.body).to.equal(undefined);
        done();
      });
    });
  });

  describe("#channelHistory", function () {
    it("should call the channel history endpoint with expected query params", function (done) {
      nock("http://localhost")
        .filteringPath(function (path) {
          return path
            .replace(/auth_timestamp=[0-9]+/, "auth_timestamp=X")
            .replace(/auth_signature=[0-9a-f]{64}/, "auth_signature=Y");
        })
        .get(
          "/apps/999/channels/history-room/history?auth_key=111111&auth_timestamp=X&auth_version=1.0&cursor=abc&direction=newest_first&end_serial=20&end_time_ms=2000&limit=50&start_serial=10&start_time_ms=1000&auth_signature=Y",
        )
        .reply(200, "{}");

      sockudo
        .channelHistory("history-room", {
          limit: 50,
          direction: "newest_first",
          cursor: "abc",
          start_serial: 10,
          end_serial: 20,
          start_time_ms: 1000,
          end_time_ms: 2000,
        })
        .then(() => done())
        .catch(done);
    });
  });
});
