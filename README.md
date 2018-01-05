# React Redux Server Render Testing

This library is aim to ease the testing for React Redux Server Rendering.
Since the server rendering test environment is somewhat lies on the Production Environment.

This library sole purpose is to ease the testing in Production Environment.

The lib is built in Node.js and Javascript with Docker ready.

## How it work

Assuming you have a react project with server side rendering set up and is ready to run, or is running somewhere.

To test the server side rendering, the simplest process is to turn off javascript in the browser and see if there is any content loaded upon the first http request, along with the initial html.

This lib is built to do just that!

When the code is started, it will fire http request to the target site, parse the return html and see if any content is loaded inside the react root Dom,

Normally, if your server render work correctly, when you inspect your return html from your http request from this command

```bash
curl http://your-site.com
```

you would see something like this,
```html
<!doctype html>
<html lang="en-us" data-reactroot="" data-reactid="1" data-react-checksum="1443206786">
<head data-reactid="2">
</head>
<body data-reactid="36">
    <div id="content" data-reactid="37">
      <div>
        <h1>My content</h1>
        <!-- .... Some more html content -->
      </div>      
    </div>
    <script data-cfasync="false" src="/cdn-cgi/scripts/af2821b0/ff.min.js"></script>
    <script charset="UTF-8" data-reactid="39">
        window.config = {
            some-config: true
        }
    </script>
    <script type="text/javascript" src="https://cdn.some-cdn-scripts.com/api/script.min.js" data-reactid="40"></script>
</body>
</html>
```

in the case that the server rendering is not process properly, the html inside `div#content` would be empty like so;

```html
<html lang="en-us" data-reactroot="" data-reactid="1" data-react-checksum="1443206786">
<head data-reactid="2">
</head>
<body data-reactid="36">
    <div id="content" data-reactid="37"></div>
    <!-- ... scripts  -->
</body>
</html>
```

_*NOTE*_: Beware that the `id="content"` is something you set up in your react project.

This library will use this different to check the server rendering;
1. it fire http GET request to get your html
2. If your project is not ready due to the CI initial start time (more in the CI section), it will wait till it get the first `statusCode: 200` request
3. It parses your return html to Dom tree
4. If the `div#content` (or any id of your choice) has any children, the test pass! Otherwise, it fails!

## Run Locally

first, do the thing we need to do in Node.js
```bash
npm install
```

To try out this test, you can try running it with this command

```bash
npm start
```

**NOTE:** This project had been tested with node `8.9.7`

The script will fail if the test is failed, it will exit with 0 status code if it passes.

### Configuration

There's some configuration available to config during runtime, though, those config must be inject using environment variables, since this project main intension is to ease the running in CI.

| ENV                | Description                                                                                                                                                                                                                                                                           | Default Value         |
|:-------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------|
| TEST_URL           | the full url to of the react server rendering website, in full url                                                                                                                                                                                                                    | http://localhost:3001 |
| REACT_ROOT_ID      | the id of the root react dom. This is the root dom that the check will start at, like `<div id="content" data-reactid="37"></div>` in how it work section                                                                                                                             | content               |
| DELAY_TRY_INTERVAL | The interval time to wait between each retry. This is the case where this test suit is ready before the React web (mostly webpack) is ready. If the request find it's not ready, it will wait for this interval of time until it triggers the next retry. The time is in milliseconds | 1000                  |
| MAX_TRY_COUNT      | The max number of time to retry, if the retries time is exeed this number, it will give up and trigger test fail flag                                                                                                                                                                 | 60                    |

#### Run with Configuration

To run locally with configuration, simply prefixed those config before the main command

```bash
TEST_URL=http://mysite.com REACT_ROOT_ID=root npm start
```

or

```bash
set TEST_URL=http://mysite.com; set REACT_ROOT_ID=root; npm start
```

in Windows.

## Docker

I have build a simple docker image for this test suite [here](https://hub.docker.com/r/rentspree/react-serverside-rendering-test/)

To use this test using docker command, you can do this

```bash
docker run -e TEST_URL=http://mysite.com rentspree/react-serverside-rendering-test:latest
```

It will run and give you the test result.

If your job is to test the react project in another docker container, don't forget to link this container to your react project and reconfigure the `TEST_URL` like so;

```bash
docker run --link your-web-container-name:web \
  -e TEST_URL=http://web \
  rentspree/react-serverside-rendering-test:latest
```

## Working with CI

// TODO:- write this later

```yaml
stages:
  - Test

test_server_render:
  stage: Test
  tags:
  - rentspree
  before_script:
  - docker pull your-web-image:{version}
  - docker run --name web-to-test-${CI_COMMIT_SHA::4} --rm -d your-web-image:{version}
  script:
  - >
    docker run --name test-${CI_COMMIT_SHA::4} --link web-to-test-${CI_COMMIT_SHA::4}:web
    -e TEST_URL=http://web:3000 --rm rentspree/react-serverside-rendering-test:latest
  after_script:
  - docker stop web-to-test-${CI_COMMIT_SHA::4}

```
