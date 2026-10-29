import assert from 'node:assert/strict';
import test from 'node:test';
import { safeCampaignLocation, safePageReferrer } from '../../lib/analytics-campaign.mjs';

test('許可したUTMだけを残し、メール・自由記述・クリックIDを除外する', () => {
  const input = 'https://neun-on.com/contact/?utm_source=google&utm_medium=cpc&utm_campaign=existing_customers_tokyo&utm_id=pilot01&email=a%40example.com&message=private&gclid=secret#detail';
  assert.equal(safeCampaignLocation(input), 'https://neun-on.com/contact/?utm_source=google&utm_medium=cpc&utm_campaign=existing_customers_tokyo&utm_id=pilot01');
});

test('個人情報を含み得るUTMと重複UTMは除外する', () => {
  assert.equal(safeCampaignLocation('https://neun-on.com/?utm_campaign=a%40example.com&utm_source=google&utm_source=other&utm_medium=paid%20search'), 'https://neun-on.com/');
});

test('外部リファラーはオリジン、サイト内はパスだけを残す', () => {
  assert.equal(safePageReferrer('https://search.example/path?q=a%40example.com', 'https://neun-on.com'), 'https://search.example');
  assert.equal(safePageReferrer('https://neun-on.com/contact/?email=a%40example.com', 'https://neun-on.com'), 'https://neun-on.com/contact/');
});
