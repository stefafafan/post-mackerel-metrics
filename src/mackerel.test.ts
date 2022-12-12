import {expect, test} from '@jest/globals'
import {
  constructServiceMetricData,
  constructServiceMetricDataMultiple,
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
  const data = [
    {
      name: metricName,
      value: metricValue,
      time: metricTime
    }
  ]

  expect(constructServiceMetricData(metricName, metricValue, metricTime)).toBe(
    JSON.stringify(data)
  )
})

test('constructServiceMetricDataMultiple', () => {
  const metrics = ['foo.bar 123', 'foo.baz 111']
  const metricTime = 1670747231
  const data = [
    {
      name: 'foo.bar',
      value: 123,
      time: metricTime
    },
    {
      name: 'foo.baz',
      value: 111,
      time: metricTime
    }
  ]

  expect(constructServiceMetricDataMultiple(metrics, metricTime)).toBe(
    JSON.stringify(data)
  )

  const metrics2 = ['foo.bar 123 1670747777', 'foo.baz 111 1670747888']
  const data2 = [
    {
      name: 'foo.bar',
      value: 123,
      time: 1670747777
    },
    {
      name: 'foo.baz',
      value: 111,
      time: 1670747888
    }
  ]

  expect(constructServiceMetricDataMultiple(metrics2, metricTime)).toBe(
    JSON.stringify(data2)
  )

  const metrics3 = [
    'foo.bar',
    'foo.baz 777',
    'hoge.fuga 999 1670747999',
    'hoge.piyo\t1000\t1670741111'
  ]
  const data3 = [
    {
      name: 'foo.baz',
      value: 777,
      time: metricTime
    },
    {
      name: 'hoge.fuga',
      value: 999,
      time: 1670747999
    },
    {
      name: 'hoge.piyo',
      value: 1000,
      time: 1670741111
    }
  ]

  expect(constructServiceMetricDataMultiple(metrics3, metricTime)).toBe(
    JSON.stringify(data3)
  )
})
