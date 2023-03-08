package uk.ac.bham.teamproject.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import uk.ac.bham.teamproject.domain.TravelGuide;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class TravelGuideRepositoryWithBagRelationshipsImpl implements TravelGuideRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<TravelGuide> fetchBagRelationships(Optional<TravelGuide> travelGuide) {
        return travelGuide.map(this::fetchTags);
    }

    @Override
    public Page<TravelGuide> fetchBagRelationships(Page<TravelGuide> travelGuides) {
        return new PageImpl<>(
            fetchBagRelationships(travelGuides.getContent()),
            travelGuides.getPageable(),
            travelGuides.getTotalElements()
        );
    }

    @Override
    public List<TravelGuide> fetchBagRelationships(List<TravelGuide> travelGuides) {
        return Optional.of(travelGuides).map(this::fetchTags).orElse(Collections.emptyList());
    }

    TravelGuide fetchTags(TravelGuide result) {
        return entityManager
            .createQuery(
                "select travelGuide from TravelGuide travelGuide left join fetch travelGuide.tags where travelGuide is :travelGuide",
                TravelGuide.class
            )
            .setParameter("travelGuide", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<TravelGuide> fetchTags(List<TravelGuide> travelGuides) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, travelGuides.size()).forEach(index -> order.put(travelGuides.get(index).getId(), index));
        List<TravelGuide> result = entityManager
            .createQuery(
                "select distinct travelGuide from TravelGuide travelGuide left join fetch travelGuide.tags where travelGuide in :travelGuides",
                TravelGuide.class
            )
            .setParameter("travelGuides", travelGuides)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
