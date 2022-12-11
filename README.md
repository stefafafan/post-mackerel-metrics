<a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>

# post-mackerel-metrics

post-mackerel-metrics is a simple GitHub Action for posting Service Metrics to [Mackerel](https://mackerel.io/).

This Action is inspired by https://github.com/yutailang0119/action-mackerel-api, but this action focuses only on posting a service metric as defined in https://mackerel.io/api-docs/entry/service-metrics#post.

Note: Currently this action does not support posting multiple service metrics at once.

## Inputs

- `api-key`: API Key value of Mackerel. Should be stored in GitHub Secrets.
- `service-name`: The Mackerel service name you want to post metrics to.
- `metric-name`: The Mackerel metric name you want to post. Accepted values are `[a-zA-Z0-9._-]+` .
- `metric-value`: The Mackerel metric value you want to post. Should be a numeric value.

## Outputs

- `time`: The time used to post the metric (epoch seconds).

## Example Usage

```yaml
uses: stefafafan/post-mackerel-metrics@v1
with:
  api-key: ${{ secrets.MACKEREL_APIKEY }}
  service-name: ${{ secrets.MACKEREL_SERVICENAME }}
  metric-name: 'my-favorite-metric.count' # [a-zA-Z0-9._-]+
  metric-value: 12345.678 # Should be a numeric value
```

Checkout a [working example workflow](https://github.com/stefafafan/post-mackerel-metrics/blob/main/.github/workflows/lines-of-code-example-workflow.yml).

## Development

Install the dependencies

```bash
$ npm install
```

Build the typescript and package it for distribution

```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:

```bash
$ npm test
```

## Author

stefafafan ([GitHub](https://github.com/stefafafan), [Twitter](https://twitter.com/stefafafan))
