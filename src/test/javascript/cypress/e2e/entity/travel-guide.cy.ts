import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('TravelGuide e2e test', () => {
  const travelGuidePageUrl = '/travel-guide';
  const travelGuidePageUrlPattern = new RegExp('/travel-guide(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const travelGuideSample = { place: 'redundant Panama', weather: '2023-03-07T05:42:54.030Z' };

  let travelGuide;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/travel-guides+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/travel-guides').as('postEntityRequest');
    cy.intercept('DELETE', '/api/travel-guides/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (travelGuide) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/travel-guides/${travelGuide.id}`,
      }).then(() => {
        travelGuide = undefined;
      });
    }
  });

  it('TravelGuides menu should load TravelGuides page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('travel-guide');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TravelGuide').should('exist');
    cy.url().should('match', travelGuidePageUrlPattern);
  });

  describe('TravelGuide page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(travelGuidePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TravelGuide page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/travel-guide/new$'));
        cy.getEntityCreateUpdateHeading('TravelGuide');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', travelGuidePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/travel-guides',
          body: travelGuideSample,
        }).then(({ body }) => {
          travelGuide = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/travel-guides+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [travelGuide],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(travelGuidePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TravelGuide page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('travelGuide');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', travelGuidePageUrlPattern);
      });

      it('edit button click should load edit TravelGuide page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TravelGuide');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', travelGuidePageUrlPattern);
      });

      it('edit button click should load edit TravelGuide page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TravelGuide');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', travelGuidePageUrlPattern);
      });

      it('last delete button click should delete instance of TravelGuide', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('travelGuide').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', travelGuidePageUrlPattern);

        travelGuide = undefined;
      });
    });
  });

  describe('new TravelGuide page', () => {
    beforeEach(() => {
      cy.visit(`${travelGuidePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TravelGuide');
    });

    it('should create an instance of TravelGuide', () => {
      cy.get(`[data-cy="place"]`).type('Horizontal Gorgeous').should('have.value', 'Horizontal Gorgeous');

      cy.get(`[data-cy="weather"]`).type('2023-03-07T11:35').blur().should('have.value', '2023-03-07T11:35');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        travelGuide = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', travelGuidePageUrlPattern);
    });
  });
});
