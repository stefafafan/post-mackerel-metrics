<a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>

# post-mackerel-metrics

post-mackerel-metrics is a simple GitHub Action for posting Service Metrics to [Mackerel](https://mackerel.io/).

This action is inspired by the [yutailang0119/action-mackerel-api](https://github.com/yutailang0119/action-mackerel-api) action, but focuses only on posting service metrics as defined in https://mackerel.io/api-docs/entry/service-metrics#post.

## Inputs

- `api-key` (required): API Key value of Mackerel. Should be stored in GitHub Secrets.
- `service-name` (required): The Mackerel service name you want to post metrics to.
- `metric-name`: The Mackerel metric name you want to post. Accepted values are `[a-zA-Z0-9._-]+` .
- `metric-value`: The Mackerel metric value you want to post. Should be a numeric value.
- `metrics`: A multiline input, used to specify multiple metrics at once. Formatted as `name value timestamp`. `timestamp` can be omitted, in which case the current time will be used.

Either the `metric-name` and `metric-value` pair or `metrics` is required. See the example usages below for details.

## Outputs

- `time`: The time used to post the metric (epoch seconds).

## Example Usage

Posting just one service metric:

```yaml
uses: stefafafan/post-mackerel-metrics@v1
with:
  api-key: ${{ secrets.MACKEREL_APIKEY }}
  service-name: ${{ secrets.MACKEREL_SERVICENAME }}
  metric-name: 'my-favorite-metric.count' # [a-zA-Z0-9._-]+
  metric-value: 12345.678 # Should be a numeric value
```

Posting multiple service metrics at once:

```yaml
uses: stefafafan/post-mackerel-metrics@v1
with:
  api-key: ${{ secrets.MACKEREL_APIKEY }}
  service-name: ${{ secrets.MACKEREL_SERVICENAME }}
  metrics: |
    my-favorite-metric.count 12345.678 1670747999
    my-favorite-metric.count2 7777.777 1670747999
```

When using `metrics` you can omit the timestamp and let the action use current time as the time.

```yaml
uses: stefafafan/post-mackerel-metrics@v1
with:
  api-key: ${{ secrets.MACKEREL_APIKEY }}
  service-name: ${{ secrets.MACKEREL_SERVICENAME }}
  metrics: |
    my-favorite-metric.count 12345.678
    my-favorite-metric.count2 7777.777
```

Checkout a [working example workflow](https://github.com/stefafafan/post-mackerel-metrics/blob/main/.github/workflows/example-lines-of-code-workflow.yml).

## Contributing

See the [Contribution Guide](https://github.com/stefafafan/post-mackerel-metrics/blob/main/CONTRIBUTING.md).

## Author

stefafafan ([GitHub](https://github.com/stefafafan), [Twitter](https://twitter.com/stefafafan))
