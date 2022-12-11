import {expect, test} from '@jest/globals'
import {
  constructServiceMetricData,
  constructServiceMetricEndpoint,
  prepareHttpClient
} from '../src/mackerel'

test('prepareHttpClient', () => {
  const apiKey = 'dummy'
  const client = prepareHttpClient(apiKey)
  expect(client.userAgent).toBe(
    'stefafafan/post-mackerel-metrics (https://github.com/stefafafan/post-mackerel-metrics)'
  )
  expect(client.requestOptions?.headers).toStrictEqual({
    'Content-Type': 'application/json',
    'X-Api-Key': 'dummy'
  })
})

test('constructServiceMetricEndpoint', () => {
  const serviceName = 'foo-service'
  expect(constructServiceMetricEndpoint(serviceName)).toBe(
    'https://api.mackerelio.com/api/v0/services/foo-service/tsdb'
  )
})

test('constructServiceMetricData', () => {
  const metricName = 'metric-a'
  const metricValue = 12345.678
  const metricTime = 1670747231

  expect(constructServiceMetricData(metricName, metricValue, metricTime))
    .toBe(`[{
    name: metric-a,
    value: 12345.678,
    time: 1670747231,
}]`)
})
