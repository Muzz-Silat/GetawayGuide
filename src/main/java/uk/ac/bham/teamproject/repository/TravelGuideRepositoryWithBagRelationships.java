package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import uk.ac.bham.teamproject.domain.TravelGuide;

public interface TravelGuideRepositoryWithBagRelationships {
    Optional<TravelGuide> fetchBagRelationships(Optional<TravelGuide> travelGuide);

    List<TravelGuide> fetchBagRelationships(List<TravelGuide> travelGuides);

    Page<TravelGuide> fetchBagRelationships(Page<TravelGuide> travelGuides);
}
