package uk.ac.bham.teamproject.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.TravelGuide;
import uk.ac.bham.teamproject.repository.TravelGuideRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.TravelGuide}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TravelGuideResource {

    private final Logger log = LoggerFactory.getLogger(TravelGuideResource.class);

    private static final String ENTITY_NAME = "travelGuide";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TravelGuideRepository travelGuideRepository;

    public TravelGuideResource(TravelGuideRepository travelGuideRepository) {
        this.travelGuideRepository = travelGuideRepository;
    }

    /**
     * {@code POST  /travel-guides} : Create a new travelGuide.
     *
     * @param travelGuide the travelGuide to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new travelGuide, or with status {@code 400 (Bad Request)} if the travelGuide has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/travel-guides")
    public ResponseEntity<TravelGuide> createTravelGuide(@Valid @RequestBody TravelGuide travelGuide) throws URISyntaxException {
        log.debug("REST request to save TravelGuide : {}", travelGuide);
        if (travelGuide.getId() != null) {
            throw new BadRequestAlertException("A new travelGuide cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TravelGuide result = travelGuideRepository.save(travelGuide);
        return ResponseEntity
            .created(new URI("/api/travel-guides/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /travel-guides/:id} : Updates an existing travelGuide.
     *
     * @param id the id of the travelGuide to save.
     * @param travelGuide the travelGuide to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated travelGuide,
     * or with status {@code 400 (Bad Request)} if the travelGuide is not valid,
     * or with status {@code 500 (Internal Server Error)} if the travelGuide couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/travel-guides/{id}")
    public ResponseEntity<TravelGuide> updateTravelGuide(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TravelGuide travelGuide
    ) throws URISyntaxException {
        log.debug("REST request to update TravelGuide : {}, {}", id, travelGuide);
        if (travelGuide.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, travelGuide.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!travelGuideRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TravelGuide result = travelGuideRepository.save(travelGuide);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, travelGuide.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /travel-guides/:id} : Partial updates given fields of an existing travelGuide, field will ignore if it is null
     *
     * @param id the id of the travelGuide to save.
     * @param travelGuide the travelGuide to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated travelGuide,
     * or with status {@code 400 (Bad Request)} if the travelGuide is not valid,
     * or with status {@code 404 (Not Found)} if the travelGuide is not found,
     * or with status {@code 500 (Internal Server Error)} if the travelGuide couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/travel-guides/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TravelGuide> partialUpdateTravelGuide(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TravelGuide travelGuide
    ) throws URISyntaxException {
        log.debug("REST request to partial update TravelGuide partially : {}, {}", id, travelGuide);
        if (travelGuide.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, travelGuide.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!travelGuideRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TravelGuide> result = travelGuideRepository
            .findById(travelGuide.getId())
            .map(existingTravelGuide -> {
                if (travelGuide.getPlace() != null) {
                    existingTravelGuide.setPlace(travelGuide.getPlace());
                }
                if (travelGuide.getWeather() != null) {
                    existingTravelGuide.setWeather(travelGuide.getWeather());
                }

                return existingTravelGuide;
            })
            .map(travelGuideRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, travelGuide.getId().toString())
        );
    }

    /**
     * {@code GET  /travel-guides} : get all the travelGuides.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of travelGuides in body.
     */
    @GetMapping("/travel-guides")
    public ResponseEntity<List<TravelGuide>> getAllTravelGuides(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of TravelGuides");
        Page<TravelGuide> page;
        if (eagerload) {
            page = travelGuideRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = travelGuideRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /travel-guides/:id} : get the "id" travelGuide.
     *
     * @param id the id of the travelGuide to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the travelGuide, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/travel-guides/{id}")
    public ResponseEntity<TravelGuide> getTravelGuide(@PathVariable Long id) {
        log.debug("REST request to get TravelGuide : {}", id);
        Optional<TravelGuide> travelGuide = travelGuideRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(travelGuide);
    }

    /**
     * {@code DELETE  /travel-guides/:id} : delete the "id" travelGuide.
     *
     * @param id the id of the travelGuide to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/travel-guides/{id}")
    public ResponseEntity<Void> deleteTravelGuide(@PathVariable Long id) {
        log.debug("REST request to delete TravelGuide : {}", id);
        travelGuideRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
