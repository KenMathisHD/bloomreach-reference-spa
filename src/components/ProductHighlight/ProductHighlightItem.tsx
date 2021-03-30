/*
 * Copyright 2020 Hippo B.V. (http://www.onehippo.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useContext, useMemo } from 'react';
import { Image } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { BrPageContext } from '@bloomreach/react-sdk';
import { ItemIdModel, ProductDetailInputProps, useProductDetail } from '@bloomreach/connector-components-react';
import { CommerceContext } from '../../CommerceContext';
import styles from './ProductHighlight.module.scss';
import { notEmpty } from '../../utils';

import { Link } from '../Link';

interface ProductHighlightItemProps extends React.ComponentPropsWithoutRef<'a'> {
  itemId: ItemIdModel;
}

type Attribute = Record<string, string>;

export function ProductHighlightItem({ itemId }: ProductHighlightItemProps): JSX.Element {
  const page = React.useContext(BrPageContext);

  const {
    smAccountId,
    smAuthKey,
    smConnector,
    smCustomAttrFields,
    smCustomVarAttrFields,
    smCustomVarListPriceField,
    smCustomVarPurchasePriceField,
    smDomainKey,
    smViewId,
  } = useContext(CommerceContext);
  const [cookies] = useCookies(['_br_uid_2']);
  const params: ProductDetailInputProps = useMemo(
    () => ({
      itemId,
      brUid2: cookies._br_uid_2,
      connector: smConnector,
      customAttrFields: smCustomAttrFields,
      customVariantAttrFields: smCustomVarAttrFields,
      customVariantListPriceField: smCustomVarListPriceField,
      customVariantPurchasePriceField: smCustomVarPurchasePriceField,
      smAccountId,
      smAuthKey,
      smDomainKey,
      smViewId,
    }),
    [
      itemId,
      cookies._br_uid_2,
      smCustomAttrFields,
      smAccountId,
      smAuthKey,
      smConnector,
      smCustomVarAttrFields,
      smCustomVarListPriceField,
      smCustomVarPurchasePriceField,
      smDomainKey,
      smViewId,
    ],
  );
  const [item, loading] = useProductDetail(params);
  const { listPrice, purchasePrice, displayName, imageSet, customAttrs } = item ?? {};
  const customAttributes = useMemo(
    () =>
      customAttrs
        ?.filter(notEmpty)
        .reduce(
          (result, attr) => Object.assign(result, { [attr.name]: attr.values?.filter(notEmpty).join(', ') ?? '' }),
          {} as Attribute,
        ),
    [customAttrs],
  );
  const price = useMemo(() => listPrice?.moneyAmounts?.[0], [listPrice]);
  const sale = useMemo(() => purchasePrice?.moneyAmounts?.[0], [purchasePrice]);
  const displayPrice = sale ?? price;
  const thumbnail = useMemo(() => imageSet?.original?.link?.href, [imageSet]);

  if (!item || loading) {
    return <div />;
  }

  return (
    <Link
      href={page?.getUrl(`/products/${item?.itemId.code ?? item?.itemId.id}`)}
      className="col-sm-3 mb4 text-reset text-decoration-none"
    >
      {thumbnail && (
        <div className={`${styles['img-container']}`}>
          <Image src={thumbnail} alt={displayName ?? ''} />
        </div>
      )}
      <div className={`${styles.name} d-block h4 text-truncate mb-3`}>{item?.displayName}</div>
      <div className={`${styles['product-number']} text-muted`}>
        Product No. <span className="text-primary ml-1">{item.itemId.code}</span>
      </div>
      <div className={`${styles.manufacturer} text-muted`}>
        Manufacturer <span className="text-primary ml-1">{customAttributes?.brand}</span>
      </div>
      <h4 className="mb-4">
        {displayPrice && (
          <div className={`${styles.price}`}>
            {displayPrice.currency ?? '$'} {displayPrice.amount}
          </div>
        )}
      </h4>
    </Link>
  );
}
