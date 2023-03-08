package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.TravelGuide;
import uk.ac.bham.teamproject.repository.TravelGuideRepository;

/**
 * Integration tests for the {@link TravelGuideResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class TravelGuideResourceIT {

    private static final String DEFAULT_PLACE = "AAAAAAAAAA";
    private static final String UPDATED_PLACE = "BBBBBBBBBB";

    private static final Instant DEFAULT_WEATHER = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_WEATHER = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/travel-guides";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TravelGuideRepository travelGuideRepository;

    @Mock
    private TravelGuideRepository travelGuideRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTravelGuideMockMvc;

    private TravelGuide travelGuide;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TravelGuide createEntity(EntityManager em) {
        TravelGuide travelGuide = new TravelGuide().place(DEFAULT_PLACE).weather(DEFAULT_WEATHER);
        return travelGuide;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TravelGuide createUpdatedEntity(EntityManager em) {
        TravelGuide travelGuide = new TravelGuide().place(UPDATED_PLACE).weather(UPDATED_WEATHER);
        return travelGuide;
    }

    @BeforeEach
    public void initTest() {
        travelGuide = createEntity(em);
    }

    @Test
    @Transactional
    void createTravelGuide() throws Exception {
        int databaseSizeBeforeCreate = travelGuideRepository.findAll().size();
        // Create the TravelGuide
        restTravelGuideMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(travelGuide)))
            .andExpect(status().isCreated());

        // Validate the TravelGuide in the database
        List<TravelGuide> travelGuideList = travelGuideRepository.findAll();
        assertThat(travelGuideList).hasSize(databaseSizeBeforeCreate + 1);
        TravelGuide testTravelGuide = travelGuideList.get(travelGuideList.size() - 1);
        assertThat(testTravelGuide.getPlace()).isEqualTo(DEFAULT_PLACE);
        assertThat(testTravelGuide.getWeather()).isEqualTo(DEFAULT_WEATHER);
    }

    @Test
    @Transactional
    void createTravelGuideWithExistingId() throws Exception {
        // Create the TravelGuide with an existing ID
        travelGuide.setId(1L);

        int databaseSizeBeforeCreate = travelGuideRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTravelGuideMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(travelGuide)))
            .andExpect(status().isBadRequest());

        // Validate the TravelGuide in the database
        List<TravelGuide> travelGuideList = travelGuideRepository.findAll();
        assertThat(travelGuideList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPlaceIsRequired() throws Exception {
        int databaseSizeBeforeTest = travelGuideRepository.findAll().size();
        // set the field null
        travelGuide.setPlace(null);

        // Create the TravelGuide, which fails.

        restTravelGuideMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(travelGuide)))
            .andExpect(status().isBadRequest());

        List<TravelGuide> travelGuideList = travelGuideRepository.findAll();
        assertThat(travelGuideList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkWeatherIsRequired() throws Exception {
        int databaseSizeBeforeTest = travelGuideRepository.findAll().size();
        // set the field null
        travelGuide.setWeather(null);

        // Create the TravelGuide, which fails.

        restTravelGuideMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(travelGuide)))
            .andExpect(status().isBadRequest());

        List<TravelGuide> travelGuideList = travelGuideRepository.findAll();
        assertThat(travelGuideList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTravelGuides() throws Exception {
        // Initialize the database
        travelGuideRepository.saveAndFlush(travelGuide);

        // Get all the travelGuideList
        restTravelGuideMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(travelGuide.getId().intValue())))
            .andExpect(jsonPath("$.[*].place").value(hasItem(DEFAULT_PLACE)))
            .andExpect(jsonPath("$.[*].weather").value(hasItem(DEFAULT_WEATHER.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTravelGuidesWithEagerRelationshipsIsEnabled() throws Exception {
        when(travelGuideRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTravelGuideMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(travelGuideRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTravelGuidesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(travelGuideRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTravelGuideMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(travelGuideRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getTravelGuide() throws Exception {
        // Initialize the database
        travelGuideRepository.saveAndFlush(travelGuide);

        // Get the travelGuide
        restTravelGuideMockMvc
            .perform(get(ENTITY_API_URL_ID, travelGuide.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(travelGuide.getId().intValue()))
            .andExpect(jsonPath("$.place").value(DEFAULT_PLACE))
            .andExpect(jsonPath("$.weather").value(DEFAULT_WEATHER.toString()));
    }

    @Test
    @Transactional
    void getNonExistingTravelGuide() throws Exception {
        // Get the travelGuide
        restTravelGuideMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTravelGuide() throws Exception {
        // Initialize the database
        travelGuideRepository.saveAndFlush(travelGuide);

        int databaseSizeBeforeUpdate = travelGuideRepository.findAll().size();

        // Update the travelGuide
        TravelGuide updatedTravelGuide = travelGuideRepository.findById(travelGuide.getId()).get();
        // Disconnect from session so that the updates on updatedTravelGuide are not directly saved in db
        em.detach(updatedTravelGuide);
        updatedTravelGuide.place(UPDATED_PLACE).weather(UPDATED_WEATHER);

        restTravelGuideMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTravelGuide.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTravelGuide))
            )
            .andExpect(status().isOk());

        // Validate the TravelGuide in the database
        List<TravelGuide> travelGuideList = travelGuideRepository.findAll();
        assertThat(travelGuideList).hasSize(databaseSizeBeforeUpdate);
        TravelGuide testTravelGuide = travelGuideList.get(travelGuideList.size() - 1);
        assertThat(testTravelGuide.getPlace()).isEqualTo(UPDATED_PLACE);
        assertThat(testTravelGuide.getWeather()).isEqualTo(UPDATED_WEATHER);
    }

    @Test
    @Transactional
    void putNonExistingTravelGuide() throws Exception {
        int databaseSizeBeforeUpdate = travelGuideRepository.findAll().size();
        travelGuide.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTravelGuideMockMvc
            .perform(
                put(ENTITY_API_URL_ID, travelGuide.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(travelGuide))
            )
            .andExpect(status().isBadRequest());

        // Validate the TravelGuide in the database
        List<TravelGuide> travelGuideList = travelGuideRepository.findAll();
        assertThat(travelGuideList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTravelGuide() throws Exception {
        int databaseSizeBeforeUpdate = travelGuideRepository.findAll().size();
        travelGuide.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTravelGuideMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(travelGuide))
            )
            .andExpect(status().isBadRequest());

        // Validate the TravelGuide in the database
        List<TravelGuide> travelGuideList = travelGuideRepository.findAll();
        assertThat(travelGuideList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTravelGuide() throws Exception {
        int databaseSizeBeforeUpdate = travelGuideRepository.findAll().size();
        travelGuide.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTravelGuideMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(travelGuide)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TravelGuide in the database
        List<TravelGuide> travelGuideList = travelGuideRepository.findAll();
        assertThat(travelGuideList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTravelGuideWithPatch() throws Exception {
        // Initialize the database
        travelGuideRepository.saveAndFlush(travelGuide);

        int databaseSizeBeforeUpdate = travelGuideRepository.findAll().size();

        // Update the travelGuide using partial update
        TravelGuide partialUpdatedTravelGuide = new TravelGuide();
        partialUpdatedTravelGuide.setId(travelGuide.getId());

        partialUpdatedTravelGuide.place(UPDATED_PLACE);

        restTravelGuideMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTravelGuide.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTravelGuide))
            )
            .andExpect(status().isOk());

        // Validate the TravelGuide in the database
        List<TravelGuide> travelGuideList = travelGuideRepository.findAll();
        assertThat(travelGuideList).hasSize(databaseSizeBeforeUpdate);
        TravelGuide testTravelGuide = travelGuideList.get(travelGuideList.size() - 1);
        assertThat(testTravelGuide.getPlace()).isEqualTo(UPDATED_PLACE);
        assertThat(testTravelGuide.getWeather()).isEqualTo(DEFAULT_WEATHER);
    }

    @Test
    @Transactional
    void fullUpdateTravelGuideWithPatch() throws Exception {
        // Initialize the database
        travelGuideRepository.saveAndFlush(travelGuide);

        int databaseSizeBeforeUpdate = travelGuideRepository.findAll().size();

        // Update the travelGuide using partial update
        TravelGuide partialUpdatedTravelGuide = new TravelGuide();
        partialUpdatedTravelGuide.setId(travelGuide.getId());

        partialUpdatedTravelGuide.place(UPDATED_PLACE).weather(UPDATED_WEATHER);

        restTravelGuideMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTravelGuide.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTravelGuide))
            )
            .andExpect(status().isOk());

        // Validate the TravelGuide in the database
        List<TravelGuide> travelGuideList = travelGuideRepository.findAll();
        assertThat(travelGuideList).hasSize(databaseSizeBeforeUpdate);
        TravelGuide testTravelGuide = travelGuideList.get(travelGuideList.size() - 1);
        assertThat(testTravelGuide.getPlace()).isEqualTo(UPDATED_PLACE);
        assertThat(testTravelGuide.getWeather()).isEqualTo(UPDATED_WEATHER);
    }

    @Test
    @Transactional
    void patchNonExistingTravelGuide() throws Exception {
        int databaseSizeBeforeUpdate = travelGuideRepository.findAll().size();
        travelGuide.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTravelGuideMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, travelGuide.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(travelGuide))
            )
            .andExpect(status().isBadRequest());

        // Validate the TravelGuide in the database
        List<TravelGuide> travelGuideList = travelGuideRepository.findAll();
        assertThat(travelGuideList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTravelGuide() throws Exception {
        int databaseSizeBeforeUpdate = travelGuideRepository.findAll().size();
        travelGuide.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTravelGuideMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(travelGuide))
            )
            .andExpect(status().isBadRequest());

        // Validate the TravelGuide in the database
        List<TravelGuide> travelGuideList = travelGuideRepository.findAll();
        assertThat(travelGuideList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTravelGuide() throws Exception {
        int databaseSizeBeforeUpdate = travelGuideRepository.findAll().size();
        travelGuide.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTravelGuideMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(travelGuide))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TravelGuide in the database
        List<TravelGuide> travelGuideList = travelGuideRepository.findAll();
        assertThat(travelGuideList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTravelGuide() throws Exception {
        // Initialize the database
        travelGuideRepository.saveAndFlush(travelGuide);

        int databaseSizeBeforeDelete = travelGuideRepository.findAll().size();

        // Delete the travelGuide
        restTravelGuideMockMvc
            .perform(delete(ENTITY_API_URL_ID, travelGuide.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TravelGuide> travelGuideList = travelGuideRepository.findAll();
        assertThat(travelGuideList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
