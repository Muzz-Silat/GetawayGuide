package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class TravelGuideTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TravelGuide.class);
        TravelGuide travelGuide1 = new TravelGuide();
        travelGuide1.setId(1L);
        TravelGuide travelGuide2 = new TravelGuide();
        travelGuide2.setId(travelGuide1.getId());
        assertThat(travelGuide1).isEqualTo(travelGuide2);
        travelGuide2.setId(2L);
        assertThat(travelGuide1).isNotEqualTo(travelGuide2);
        travelGuide1.setId(null);
        assertThat(travelGuide1).isNotEqualTo(travelGuide2);
    }
}
