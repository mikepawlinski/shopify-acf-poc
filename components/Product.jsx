import Image from "next/image";
import {Tooltip} from 'react-tooltip';
import styles from './Product.module.scss';

const Product = ({product}) => {
  const variant = product.shopify.variants.nodes[0];

  return <div>
    <h2
      className={styles.title}
      data-tooltip-id="tooltip"
      data-tooltip-content="Shopify Storefront API"
    >
      {product.shopify.title}
    </h2>
    <div data-tooltip-id="tooltip" data-tooltip-content="WordPress">
      <div dangerouslySetInnerHTML={{ __html: product.description ?? "" }}></div>
    </div>
    <div className={styles.metadata}>
      First variant:
      <div data-tooltip-id="tooltip" data-tooltip-content="Shopify Storefront API">SKU: {variant.sku}</div>
      <div data-tooltip-id="tooltip" data-tooltip-content="Shopify Storefront API">Variant: {variant.title}</div>
      <div data-tooltip-id="tooltip" data-tooltip-content="Shopify Storefront API">Price: ${variant.price.amount}</div>
    </div>
    <details>
      <summary className={styles.action}>See all variants</summary>

      <div>
        {product.shopify.variants.nodes.map(variant => (
          <div className={styles.metadata} key={variant.sku}>
            <div></div>
            <div data-tooltip-id="tooltip" data-tooltip-content="Shopify Storefront API">SKU: {variant.sku}</div>
            <div data-tooltip-id="tooltip" data-tooltip-content="Shopify Storefront API">Variant: {variant.title}</div>
            <div data-tooltip-id="tooltip" data-tooltip-content="Shopify Storefront API">Price: ${variant.price.amount}</div>
          </div>
        ))}
      </div>
    </details>
    <div className={styles.images}>
      {product.shopify.images.nodes.map(image => (
        <Image
          key={image.src}
          data-tooltip-id="tooltip" data-tooltip-content="Shopify Storefront API"
          src={image.src}
          quality={65}
          width={300}
          height={300}
        />
      ))}
    </div>
    <div className={styles.wrapper}>
      <div data-tooltip-id="tooltip" data-tooltip-content="WordPress">
        <div dangerouslySetInnerHTML={{ __html: product.technicalDetails ?? "" }}></div>
      </div>
      <div data-tooltip-id="tooltip" data-tooltip-content="WordPress" className={styles.video}>
        <iframe
          width="560"
          height="315"
          src={product.youtubeVideo.url}
          frameBorder="0"></iframe>
      </div>
    </div>

    <details>
      <summary className={styles.action}>
        Display JSON data
      </summary>

      <code style={{whiteSpace: 'pre-wrap'}}>
        {JSON.stringify(product, null, 2)}
      </code>
    </details>
    <Tooltip id="tooltip" />
  </div>
}

export default Product;
