import * as readline from 'readline'
import { chromium } from 'playwright'
import { createObjectCsvWriter } from 'csv-writer'

interface Product {
  title: string
  price: string
  search: string
  url: string
}

const csvWriter = createObjectCsvWriter({
  path: 'products.csv',
  header: [
    { id: 'title', title: 'Title' },
    { id: 'price', title: 'Price' },
    { id: 'search', title: 'Search' },
    { id: 'url', title: 'URL' }
  ]
})

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const baseUrl = 'https://www.amazon.com'

const scrape = async (): Promise<void> => {
  const search = await getInput('Enter a search term: ')
  const products = await getProducts(search)
  const sortedProducts = sortByPrice(products)
  const topThreeProducts = sortedProducts.slice(0, 3)
  await saveToCsv(topThreeProducts)
}

const requestWithRetry = async (page, link) => {
  const MAX_RETRIES = 5
  let retry_count = 0
  while (retry_count < MAX_RETRIES) {
    try {
      await page.goto(link)
      break
    } catch (error) {
      retry_count += 1
      if (retry_count == MAX_RETRIES) {
        console.log('request timed out')
        break
      }
      await delay(1500)
    }
  }
}

const getInput = async (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise<string>((resolve) => {
    rl.question(query, (input) => {
      resolve(input.trim())
      rl.close()
    })
  })
}

export const getProducts = async (searchTerm: string): Promise<Product[]> => {
  const browser = await chromium.launch({
    headless: false,
    args: [`--headless=new`]
  })
  const page = await browser.newPage({ strictSelectors: false })

  await requestWithRetry(page, `${baseUrl}/s?k=${searchTerm}`)
  await page.reload()
  await page.waitForLoadState()
  await page.reload()
  await page.waitForLoadState()

  const productElements = await page.$$(
    `//div[@data-component-type='s-search-result']`
  )

  // await delay(15000)
  const products: Product[] = await Promise.all(
    productElements.map(async (productElement) => {
      const productUrl = await productElement.$eval('a', (a) => a.href)
      const productName = await productElement.$eval(
        `//span[@class='a-size-medium a-color-base a-text-normal']`,
        (span) => span.textContent
      )

      const productPrice = await productElement.$eval(
        `//span[@class='a-offscreen']`,
        (span) => span.textContent
      )

      return {
        title: productName ?? '',
        price: productPrice ?? '',
        search: searchTerm,
        url: productUrl ?? ''
      }
    })
  )

  await browser.close()
  return products
}

const sortByPrice = (products: Product[]): Product[] => {
  return products.sort(
    (p1, p2) =>
      parseFloat(p1.price.replace(/[^0-9.-]+/g, '')) -
      parseFloat(p2.price.replace(/[^0-9.-]+/g, ''))
  )
}

const saveToCsv = async (products: Product[]): Promise<void> => {
  const records = products.map((product) => ({
    title: product.title,
    price: product.price,
    search: product.search,
    url: product.url
  }))

  await csvWriter.writeRecords(records).then(() => {
    console.log('Done!')
  })
}

;(async () => {
  await scrape()
})()
