import "./CardOffers.scss";

const CardOffers = ({
  paginatedOffers,
  filteredOffersCount,
  loadingOffers,
  errorOffers,
  isCustomer,
  isFavorite,
  onAddFavorite,
  onRemoveFavorite,
  favLoading,
  getProviderLabel,
  selectedOffer,
  onSelectOffer,
  onCloseDetail,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const contentClassName = `service-catalog__content${
    selectedOffer ? " service-catalog__content--with-detail" : ""
  }`;

  return (
    <section className={contentClassName}>
      <div className="service-catalog__left">
        <div className="service-catalog__list">
          {errorOffers && (
            <div className="service-catalog__error">{errorOffers}</div>
          )}

          {loadingOffers && paginatedOffers.length === 0 && (
            <div className="service-catalog__loading">
              Chargement des services...
            </div>
          )}

          {!loadingOffers && filteredOffersCount === 0 && !errorOffers && (
            <div className="service-catalog__empty">
              Aucun service ne correspond à vos critères pour le moment.
            </div>
          )}

          {paginatedOffers.map((offer) => (
            <article
              key={offer.id_offer}
              className="service-card"
              onClick={() => onSelectOffer(offer)}
            >
              <div className="service-card__top">
                <div className="service-card__avatar">
                  <div className="service-card__avatar-circle">
                    {(offer.category || "S")[0].toUpperCase()}
                  </div>
                </div>

                <div className="service-card__header">
                  <div className="service-card__title-row">
                    <h2 className="service-card__title">
                      {offer.category || "Service"}
                    </h2>
                    <span className="service-card__price">
                      {offer.price ? `${offer.price} €` : "Sur devis"}
                    </span>
                  </div>

                  <div className="service-card__provider-line">
                    Proposé par {getProviderLabel(offer)}
                  </div>

                  <div className="service-card__meta">
                    {offer.duration && (
                      <span className="service-card__meta-item">
                        Durée : {offer.duration}
                      </span>
                    )}
                    {offer.disponibility && (
                      <span className="service-card__meta-item">
                        {offer.disponibility}
                      </span>
                    )}
                    {offer.perimeter_of_displacement && (
                      <span className="service-card__meta-item">
                        Jusqu’à {offer.perimeter_of_displacement}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="service-card__description">{offer.description}</p>

              <div className="service-card__tags">
                {offer.category && (
                  <span className="service-card__tag">{offer.category}</span>
                )}
                {offer.perimeter_of_displacement && (
                  <span className="service-card__tag">
                    Rayon : {offer.perimeter_of_displacement}
                  </span>
                )}
              </div>

              <div
                className="service-card__bottom"
                onClick={(e) => e.stopPropagation()}
              >
                {isCustomer ? (
                  <div className="service-card__actions">
                    {isFavorite(offer.id_offer) ? (
                      <button
                        type="button"
                        className="service-card__btn service-card__btn--ghost"
                        onClick={() => onRemoveFavorite(offer.id_offer)}
                        disabled={favLoading}
                      >
                        Retirer des favoris
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="service-card__btn"
                        onClick={() => onAddFavorite(offer.id_offer)}
                        disabled={favLoading}
                      >
                        Ajouter aux favoris
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="service-card__hint">
                    Connectez-vous en tant que client pour ajouter aux favoris.
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="service-catalog__pagination">
            <button
              type="button"
              className={`service-catalog__page-btn ${
                currentPage === 1 ? "service-catalog__page-btn--disabled" : ""
              }`}
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ◀
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`service-catalog__page-btn ${
                  page === currentPage
                    ? "service-catalog__page-btn--active"
                    : ""
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className={`service-catalog__page-btn ${
                currentPage === totalPages
                  ? "service-catalog__page-btn--disabled"
                  : ""
              }`}
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              disabled={currentPage === totalPages}
            >
              ▶
            </button>
          </div>
        )}
      </div>

      {selectedOffer && (
        <aside className="service-detail">
          <button
            type="button"
            className="service-detail__close"
            onClick={onCloseDetail}
          >
            ✕
          </button>

          <div className="service-detail__header">
            <div className="service-detail__avatar">
              {(selectedOffer.category || "S")[0].toUpperCase()}
            </div>
            <div className="service-detail__titles">
              <span className="service-detail__provider-name">
                {getProviderLabel(selectedOffer)}
              </span>
              <span className="service-detail__offer-title">
                {selectedOffer.category || "Service"}
              </span>
            </div>
          </div>

          <div className="service-detail__section">
            <h3>À propos du service</h3>
            <p>{selectedOffer.description}</p>
          </div>

          <div className="service-detail__section service-detail__grid">
            <div className="service-detail__info">
              <strong>Durée</strong>
              <span>{selectedOffer.duration || "Non précisé"}</span>
            </div>
            <div className="service-detail__info">
              <strong>Disponibilité</strong>
              <span>{selectedOffer.disponibility || "Non précisé"}</span>
            </div>
            <div className="service-detail__info">
              <strong>Zone de déplacement</strong>
              <span>
                {selectedOffer.perimeter_of_displacement || "Non précisé"}
              </span>
            </div>
            <div className="service-detail__info">
              <strong>Tarif</strong>
              <span>
                {selectedOffer.price ? `${selectedOffer.price} €` : "Sur devis"}
              </span>
            </div>
          </div>

          <button type="button" className="service-detail__cta">
            Demander ce service
          </button>
        </aside>
      )}
    </section>
  );
};

export default CardOffers;
