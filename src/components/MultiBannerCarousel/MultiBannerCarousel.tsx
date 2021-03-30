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

import React from 'react';
import { Carousel, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Reference } from '@bloomreach/spa-sdk';
import { BrManageContentButton, BrProps } from '@bloomreach/react-sdk';
import { getEffectiveMultipleDocumentParameters } from '../param-utils';

import { Banner } from './Banner';
import styles from './MultiBannerCarousel.module.scss';

const MAX_DOCUMENTS = 10;
const DOCUMENTS_PER_SLIDE = 4;

interface MultiBannerCarouselModels {
  document1?: Reference;
  document2?: Reference;
  document3?: Reference;
  document4?: Reference;
  document5?: Reference;
  document6?: Reference;
  document7?: Reference;
  document8?: Reference;
  document9?: Reference;
  document10?: Reference;
}

interface MultiBannerCarouselParameters {
  interval?: number;
  title?: string;
}

export function MultiBannerCarousel({ component, page }: BrProps): React.ReactElement | null {
  const { interval = 0, title } = component.getParameters<MultiBannerCarouselParameters>();
  const models = component.getModels<MultiBannerCarouselModels>();
  const docParams = getEffectiveMultipleDocumentParameters(page, models, MAX_DOCUMENTS);
  const slides = [];

  while (docParams.length) {
    slides.push(docParams.splice(0, DOCUMENTS_PER_SLIDE));
  }

  if (!slides.length) {
    return page.isPreview() ? (
      <div className="has-edit-button">
        <BrManageContentButton
          documentTemplateQuery="new-banner-document"
          folderTemplateQuery="new-banner-folder"
          parameter="document1"
          root="brxsaas/banners"
          relative
        />
      </div>
    ) : null;
  }

  return (
    <div className="mw-container mx-auto my-4">
      {title && <h3 className="mb-4 text-center">{title}</h3>}
      <Carousel
        controls={slides.length > 1}
        indicators={false}
        interval={interval}
        prevIcon={<FontAwesomeIcon icon={faChevronLeft} size="2x" className="text-secondary" />}
        nextIcon={<FontAwesomeIcon icon={faChevronRight} size="2x" className="text-secondary" />}
        className={styles.carousel}
      >
        {slides.map((slide, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Carousel.Item key={index}>
            <Row>
              {slide.map((docParam) => (
                <Col
                  key={docParam.document.getId()}
                  as={Banner}
                  xs={12 / DOCUMENTS_PER_SLIDE}
                  document={docParam.document}
                  parameterName={docParam.parameterName}
                />
              ))}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}
