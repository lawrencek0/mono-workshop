/* eslint-disable camelcase */
export function formatPhageDbPhages(phages) {
  return phages
    .filter(({ fasta_file, isolation_host }) =>
      Boolean(fasta_file) &&
        Boolean(isolation_host) &&
        Boolean(isolation_host.genus))
    .map(({
      phage_name: phageName,
      old_names: oldNames,
      pcluster,
      psubcluster,
      isolation_host,
      end_type,
      fasta_file: fastaFile
    }) => ({
      phageName,
      oldNames,
      genus: isolation_host.genus,
      cluster: pcluster ? pcluster.cluster : 'Unclustered',
      subcluster: psubcluster ? psubcluster.subcluster : 'None',
      endType: end_type === 'CIRC' ? 'circular' : end_type,
      fastaFile
    }));
}
/* eslint-enable */

export function formatPetPhages(phages) {
  return phages.map(phage =>
    ['phageName', 'genus', 'cluster', 'subcluster'].reduce(
      (accumulator, curr, i) =>
        Object.assign(accumulator, {
          [curr]: phage[i]
        }),
      {}
    ));
}
