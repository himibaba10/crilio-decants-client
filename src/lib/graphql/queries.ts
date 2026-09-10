export const HOME_CATALOG_QUERY = /* GraphQL */ `
  query HomeCatalog {
    products(first: 24, where: { status: "publish", orderby: { field: DATE, order: DESC } }) {
      nodes {
        __typename
        databaseId
        name
        slug
        ... on SimpleProduct {
          price
          regularPrice
          stockStatus
          image {
            sourceUrl
            altText
          }
          productCategories {
            nodes {
              slug
              name
            }
          }
        }
        ... on VariableProduct {
          price
          regularPrice
          stockStatus
          image {
            sourceUrl
            altText
          }
          productCategories {
            nodes {
              slug
              name
            }
          }
        }
      }
    }
    productCategories(first: 12, where: { hideEmpty: true, orderby: COUNT, order: DESC }) {
      nodes {
        databaseId
        name
        slug
        count
        image {
          sourceUrl
          altText
        }
      }
    }
  }
`

/** Same product shape as homepage — keep shop filters in app code for WooGraphQL compatibility. */
export const SHOP_CATALOG_QUERY = /* GraphQL */ `
  query ShopCatalog {
    products(first: 100, where: { status: "publish", orderby: { field: DATE, order: DESC } }) {
      nodes {
        __typename
        databaseId
        name
        slug
        ... on SimpleProduct {
          price
          regularPrice
          stockStatus
          image {
            sourceUrl
            altText
          }
          productCategories {
            nodes {
              slug
              name
            }
          }
        }
        ... on VariableProduct {
          price
          regularPrice
          stockStatus
          image {
            sourceUrl
            altText
          }
          productCategories {
            nodes {
              slug
              name
            }
          }
        }
      }
    }
    productCategories(first: 30, where: { hideEmpty: false, orderby: COUNT, order: DESC }) {
      nodes {
        databaseId
        name
        slug
        count
        image {
          sourceUrl
          altText
        }
      }
    }
  }
`

const PRODUCT_CARD_FIELDS = /* GraphQL */ `
  __typename
  databaseId
  name
  slug
  ... on SimpleProduct {
    price
    regularPrice
    stockStatus
    image {
      sourceUrl
      altText
    }
    productCategories {
      nodes {
        slug
        name
      }
    }
  }
  ... on VariableProduct {
    price
    regularPrice
    stockStatus
    image {
      sourceUrl
      altText
    }
    productCategories {
      nodes {
        slug
        name
      }
    }
  }
`

export const PRODUCT_BY_SLUG_QUERY = /* GraphQL */ `
  query ProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      __typename
      databaseId
      name
      slug
      ... on SimpleProduct {
        price
        regularPrice
        stockStatus
        shortDescription
        description
        image {
          sourceUrl
          altText
        }
        galleryImages {
          nodes {
            sourceUrl
            altText
          }
        }
        productCategories {
          nodes {
            name
            slug
          }
        }
        related(first: 8) {
          nodes {
            ${PRODUCT_CARD_FIELDS}
          }
        }
      }
      ... on VariableProduct {
        price
        regularPrice
        stockStatus
        shortDescription
        description
        image {
          sourceUrl
          altText
        }
        galleryImages {
          nodes {
            sourceUrl
            altText
          }
        }
        productCategories {
          nodes {
            name
            slug
          }
        }
        attributes {
          nodes {
            name
            options
          }
        }
        variations(first: 30) {
          nodes {
            databaseId
            name
            price
            regularPrice
            stockStatus
            attributes {
              nodes {
                name
                value
              }
            }
            image {
              sourceUrl
              altText
            }
          }
        }
        related(first: 8) {
          nodes {
            ${PRODUCT_CARD_FIELDS}
          }
        }
      }
    }
  }
`

export const PRODUCT_SLUGS_QUERY = /* GraphQL */ `
  query ProductSlugs {
    products(first: 100, where: { status: "publish" }) {
      nodes {
        slug
      }
    }
  }
`
